import React, { useState, useEffect, Fragment } from 'react';
import '../App.css';
import CustomCarousel from './customCarousel.js';
import AuthService from '../services/auth-service';
import axios from "axios";
import ProfilePopover from './profile_popover.js';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from './ImagePreview';

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
  EuiText,
  EuiBasicTable,
  EuiLink,
  EuiButton,
  EuiModal,
  EuiOverlayMask,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiButtonEmpty,
  EuiFieldNumber
} from '@elastic/eui';

export default function Home() {

  const [items, setItems] = useState([]);
  const [file, setFile] = useState(buildFileSelector());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [dataUri, setDataUri] = useState('');
  const [photoMode, setphotoMode] = useState(false);
  const [hasCamera, sethasCamera] = useState(false);
  const closeModal = () => {
    setIsModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    elementsEuiOverlay[0].remove();
  }

  function handleTakePhoto(dataUri) {
    setDataUri(dataUri);
    setphotoMode(false);
    showModal();
  }

  const showModal = () => setIsModalVisible(true);

  const config = {
    headers: {
      Authorization: JSON.parse(localStorage.getItem('foodTrackerAuthorization'))
    }
  }

  const API_URL_PRODUCTS = 'http://localhost:8080/products/';
  useEffect(() => {
    axios
      .get(API_URL_PRODUCTS + 'getProducts', config)
      .then((response) => {
        setItems(response.data);
      })

    navigator.getMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    navigator.getMedia({ video: true }, function () {
      sethasCamera(true);
    }, function () {
      sethasCamera(false);
    });

    // eslint-disable-next-line
  }, [])

  const removeOneItem = (item) => {
    axios.post(API_URL_PRODUCTS + 'updateProduct', {
      "quantity": -1,
      "code": item.puk.code
    }, config).then(() => {
      getProducts().then((response) => {
        setItems(response.data);
      });
    }, (error) => {
      console.log(error);
    });
  };

  const deleteItem = (item) => {
    axios.post(API_URL_PRODUCTS + 'updateProduct', {
      "quantity": -item.quantity,
      "code": item.puk.code
    }, config).then(() => {
      getProducts().then((response) => {
        setItems(response.data);
      });
    }, (error) => {
      console.log(error);
    });
  };

  const actions = [
    {
      name: 'Ajouter 1 item',
      description: 'Ajouter 1 de quantité à cet item',
      icon: 'plusInCircle',
      type: 'icon',
      onClick: addOneItem
    },
    {
      name: 'Supprimer 1 item',
      description: 'Supprimer 1 de quantité à cet item',
      icon: 'minusInCircle',
      type: 'icon',
      onClick: removeOneItem
    },
    {
      name: 'Supprimer totalement cet item',
      description: 'Supprimer totalement cet item',
      icon: 'trash',
      type: 'icon',
      color: 'danger',
      onClick: deleteItem
    }
  ];

  const columns = [
    {
      field: 'product_name',
      name: 'Produit',
    },
    {
      field: 'quantity',
      name: 'Quantité',
    },
    {
      actions,
      width: '1%'
    }
  ];

  const handleFileSelect = (e) => {
    if (hasCamera) {
      setphotoMode(true);
    }
    else {
      e.preventDefault();
      file.click();
    }
  }

  const getProducts = () => {
    return axios
      .get(API_URL_PRODUCTS + 'getProducts', config)
      .then(response => {
        return response;
      });
  }

  function saveAction() {
    addNewItem();
  }

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  function addNewItem() {
    const data = new FormData();

    if (hasCamera) {
      // Split the base64 string in data and contentType
      var block = dataUri.split(";");
      // Get the content type of the image
      var contentType = block[0].split(":")[1];
      // get the real base64 content of the file
      var realData = block[1].split(",")[1];
      // Convert it to a blob to upload
      var blob = b64toBlob(realData, contentType);
      data.append('image', blob);
    }
    else {
      console.log(file.files[0]);
      data.append('image', file.files[0]);
    }

    data.append("quantity", quantity);
    axios.post(API_URL_PRODUCTS + 'addProduct', data, config).then(() => {
      getProducts().then((response) => {
        setItems(response.data);
        file.remove();
        setFile(buildFileSelector());
      });
    }, (error) => {
      console.log(error);
    });
    closeModal();
  }

  function launchModal() {
    showModal();
  }

  function addOneItem(item) {
    axios.post(API_URL_PRODUCTS + 'updateProduct', {
      "quantity": 1,
      "code": item.puk.code
    }, config).then(() => {
      getProducts().then((response) => {
        setItems(response.data);
      });
    }, (error) => {
      console.log(error);
    });
  }

  function buildFileSelector() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', 'image/*');
    fileSelector.onchange = launchModal;
    return fileSelector;
  }

  let modal = (
    <EuiOverlayMask>
      <EuiModal onClose={closeModal}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>Définir la quantité</EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          {hasCamera ? (
            <Fragment>
              <ImagePreview dataUri={dataUri} />
              <EuiSpacer />
            </Fragment>
          ) : (
              null
            )}
          <EuiFieldNumber
            placeholder="1"
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value, 10))}
          />
        </EuiModalBody>
        <EuiModalFooter>
          <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
          <EuiButton onClick={saveAction} fill>
            Save
            </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  )

  if (AuthService.getCurrentUser()) {

    if (photoMode) {
      return (
        <Camera
          onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
          isFullscreen={false}
          idealFacingMode={FACING_MODES.ENVIRONMENT}
          imageType={IMAGE_TYPES.JPG}
          sizeFactor={1}
          isImageMirror={false}
        />
      );
    }
    else {
      return (
        <EuiPage>
          {isModalVisible && modal}
          <EuiPageBody>
            <EuiPageContent>
              <EuiPageContentHeader>
                <EuiPageContentHeaderSection style={{ "width": "100%" }}>
                  <EuiFlexGroup justifyContent="spaceBetween" style={{ "width": "100%" }}>
                    <EuiFlexItem grow={false} tyle={{ minWidth: 200 }}>
                      <EuiTitle size='l'>
                        <h1>Food Tracker</h1>
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
                      <h3>Aliments</h3>
                    </EuiTitle>
                    <EuiBasicTable
                      items={items}
                      columns={columns}
                      hasActions={true}
                    />
                    <EuiSpacer />
                    <EuiFlexGroup justifyContent="spaceAround">
                      <EuiFlexItem grow={false}>
                        <EuiButton iconType="plusInCircleFilled" onClick={handleFileSelect}>
                          Ajouter un article
                      </EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiTitle size='m' style={{ margin: 'auto' }}>
                      <h2>Ma liste de course</h2>
                    </EuiTitle>
                    <EuiText textAlign="center">
                      <h3>Paniers automatiques</h3>
                    </EuiText>
                    <CustomCarousel />
                    <EuiSpacer />
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer />
                <EuiLink href="/home" >
                  Home
              </EuiLink>{' '}
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      );
    }
  }
  else {
    window.location.href = '/login';
  }
}