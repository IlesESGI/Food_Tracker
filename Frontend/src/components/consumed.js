import React, { useState, useEffect, Fragment } from 'react';
import '../App.css';
import AuthService from '../services/auth-service';
import axios from "axios";
import ProfilePopover from './profile_popover.js';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiBasicTable,
  EuiLink,
  EuiGlobalToastList,
  EuiButton,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink,
} from '@elastic/eui';

export default function Consumed() {

  const [items, setItems] = useState([]);
  const [toasts, setToasts] = useState([]);
  const API_URL_PRODUCTS = 'http://localhost:8080/products/';

  const toastsList = [
    {
      id: "0",
      title: 'Item(s) ajouté(s) !',
      color: 'success',
      text: <p>Item(s) ajouté(s) avec succès</p>
    },
    {
      id: "1",
      title: 'Item(s) supprimé(s) !',
      color: 'success',
      text: <p>Item(s) supprimé(s) avec succès</p>
    },
    {
      id: "2",
      title: 'Erreur',
      color: 'danger',
      iconType: 'help',
      text: <p>L'item n'a pas pu être ajouté car le code n'est pas détécté, essayez de un angle et de meilleurs conditions d'éclairages</p>
    },
    {
      id: "3",
      title: 'Erreur',
      color: 'danger',
      iconType: 'help',
      text: <p>L'item n'a pas pu être ajouté car le produit n'est pas en base</p>
    },
    {
      id: "4",
      title: 'Erreur',
      color: 'danger',
      iconType: 'help',
      text: <p>Serveur non joignable</p>
    },
    {
      id: "5",
      title: 'Erreur',
      color: 'danger',
      iconType: 'help',
      text: <p>La suppression n'a pas pu s'effectuer (voir la console pour plus de détails)</p>
    },
    {
      id: "6",
      title: 'Erreur',
      color: 'danger',
      iconType: 'help',
      text: <p>Une erreur s'est produite (voir la console pour plus de détails)</p>
    },
    {
      id: "7",
      title: 'Erreur',
      color: 'danger',
      iconType: 'help',
      text: <p>Impossible de diminuer la quanité davantage</p>
    },
    {
      id: "8",
      title: 'Succès',
      color: 'success',
      text: <p>Liste mise à jour avec succès</p>
    },
    {
      id: "9",
      title: 'Erreur',
      color: 'danger',
      iconType: 'help',
      text: <p>Impossible de consommer plus qu'il n'y en a</p>
    }
  ];

  const removeToast = removedToast => {
    setToasts(toasts.filter(toast => toast.id !== removedToast.id));
  };

  function handleToastError(code) {
    switch (code) {
      case 404:
        setToasts(toasts.concat(toastsList[3]));
        break;
      case 400:
        setToasts(toasts.concat(toastsList[2]));
        break;
      case 99:
        setToasts(toasts.concat(toastsList[7]));
        break;
      case 98:
        setToasts(toasts.concat(toastsList[9]));
        break;
      default:
        setToasts(toasts.concat(toastsList[4]));
    }
  }

  const config = {
    headers: {
      Authorization: JSON.parse(localStorage.getItem('foodTrackerAuthorization'))
    }
  }

  useEffect(() => {
    axios
      .get(API_URL_PRODUCTS + 'getProducts', config)
      .then((response) => {
        setItems(response.data.map(item => ({ code: item.puk.code, product_name: item.product_name, current_quantity: item.quantity, quantity: 0 })));
      }, () => {
        handleToastError();
      })

    // eslint-disable-next-line
  }, [])

  function updateProducts() {

    axios.post(API_URL_PRODUCTS + 'updateList',
      items.map(item => ({ code: item.code, quantity: item.quantity })).filter(item => item.quantity > 0), config)
      .then((response) => {
        setToasts(toasts.concat(toastsList[8]));
        setTimeout(() => {
          window.location.href = '/home';
        }, 2000);
      }, (error) => {
        console.log(error);
        if (error.response) {
          if (error.response.status === 404) {
            setToasts(toasts.concat(toastsList[3]));
          }
        }
        else {
          setToasts(toasts.concat(toastsList[6]));
        }
      });

  }

  const addItem = item => {
    if (item.quantity < item.current_quantity) {
      const elementsIndex = items.findIndex(element => element.code === item.code);
      let newArray = [...items];
      newArray[elementsIndex] = { ...newArray[elementsIndex], quantity: newArray[elementsIndex].quantity + 1 };
      setItems(newArray);
    }
    else {
      handleToastError(98);
    }

  };

  const removeItem = item => {
    if (item.quantity > 0) {
      const elementsIndex = items.findIndex(element => element.code === item.code);
      let newArray = [...items];
      newArray[elementsIndex] = { ...newArray[elementsIndex], quantity: newArray[elementsIndex].quantity - 1 };
      setItems(newArray);
    }
    else {
      handleToastError(99);
    }
  };

  const actions = [
    {
      name: 'Ajouter 1 item',
      description: 'Ajouter 1 de quantité à cet item',
      icon: 'plusInCircle',
      type: 'icon',
      onClick: addItem
    },
    {
      name: 'Supprimer 1 item',
      description: 'Supprimer 1 de quantité à cet item',
      icon: 'minusInCircle',
      type: 'icon',
      onClick: removeItem
    }
  ];

  const columns = [
    {
      field: 'product_name',
      name: 'Produit'
    },
    {
      field: 'current_quantity',
      name: 'Quantité actuelle'
    },
    {
      field: 'quantity',
      name: 'Quantité consommé'
    },
    {
      actions
    }
  ];

  if (AuthService.getCurrentUser()) {
    return (
      <Fragment>
        <EuiHeader>
          <EuiHeaderSectionItem border="right">
            <EuiHeaderLogo href="/home">Food Tracker</EuiHeaderLogo>
          </EuiHeaderSectionItem>
          <EuiHeaderSectionItem>
            <EuiHeaderLinks aria-label="App navigation links example">
              <EuiHeaderLink href="/home">
                Home
        </EuiHeaderLink>
              <EuiHeaderLink href="/paniers">
                Mes paniers
        </EuiHeaderLink>
              <EuiHeaderLink href="/recettes">Mes recettes</EuiHeaderLink>
              <EuiHeaderLink href="/download">Télécharger les données clients</EuiHeaderLink>

              <EuiHeaderLink iconType="help" href="#">
                Help
        </EuiHeaderLink>
            </EuiHeaderLinks>
          </EuiHeaderSectionItem>
        </EuiHeader>
        <EuiPage>
          <EuiGlobalToastList
            toasts={toasts}
            dismissToast={removeToast}
            toastLifeTimeMs={6000}
          />
          <EuiPageBody>
            <EuiPageContent>
              <EuiPageContentHeader>
                <EuiPageContentHeaderSection style={{ "width": "100%" }}>
                  <EuiFlexGroup justifyContent="spaceBetween" style={{ "width": "100%" }}>
                    <EuiFlexItem grow={false} tyle={{ minWidth: 200 }}>
                      <EuiTitle size='l'>
                        <h1>Consommation</h1>
                      </EuiTitle>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <ProfilePopover />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiPageContentHeaderSection>
              </EuiPageContentHeader>
              <EuiPageContentBody>
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiTitle size='m'>
                      <h3>Aliments consomés</h3>
                    </EuiTitle>
                    <EuiBasicTable
                      items={items}
                      columns={columns}
                      hasActions={true}
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer />
                <EuiButton onClick={updateProducts} fill>
                  Mettre à jour
            </EuiButton>
                <EuiSpacer />
                <EuiLink href="/home" >
                  Home
              </EuiLink>{' '}
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      </Fragment>
    );
  }
  else {
    window.location.href = '/login';
  }
}
