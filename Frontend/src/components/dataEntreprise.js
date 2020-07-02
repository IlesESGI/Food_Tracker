import React, { Component, Fragment } from 'react';
import AuthService from '../services/auth-service';
import axios from "axios";

import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiFieldNumber,
  EuiRadioGroup,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink
} from '@elastic/eui';

// set up cookies

export default class DataEntreprise extends Component {
  constructor(props) {
    super(props)

    if (!AuthService.getCurrentUser()) {
      window.location.href = '/login';
    }

    this.state = {
      error: [],
      ageMin: null,
      ageMax: null,
      ageMinError: null,
      ageMaxError: null,
      radioIdSelected: 'Homme'
    }
  }


  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onDownloadClick = (e) => {
    e.preventDefault();
    this.setState({ error: [] });
    this.setState({ ageMinError: null });
    this.setState({ ageMaxError: null });

    if (!this.state.ageMin) {
      this.setState({ ageMinError: 'Age minimum vide' })
      this.setState({ error: ['Age minimum vide'] })
      return;
    }

    if (this.state.ageMin < 0 || this.state.ageMin > 120) {
      this.setState({ ageMinError: 'Age minimum incorrecte' })
      this.setState({ error: ['Age minimum incorrecte'] })
      return;
    }

    if (!this.state.ageMax) {
      this.setState({ ageMaxError: 'Age maximum vide' })
      this.setState({ error: ['Age maximum vide'] })
      return;
    }

    if (this.state.ageMax < 0 || this.state.age > 120) {
      this.setState({ ageMaxError: 'Age maximum is incorrect' })
      this.setState({ error: ['Age maximum is incorrect'] })
      return;
    }

    if (this.state.ageMin > this.state.ageMax) {
      this.setState({ ageError: 'Age maximum doit être supérieur à l\'age minimum' })
      this.setState({ ageMinError: 'Age maximum doit être supérieur à l\'age minimum' })
      this.setState({ error: ['Age maximum doit être supérieur à l\'age minimum'] })
      return;
    }

    this.launchDownloadRequest();
  }

  launchDownloadRequest = async () => {

    const config = {
      headers: {
        Authorization: JSON.parse(localStorage.getItem('foodTrackerAuthorization'))
      }
    }

    const API_URL_ENTREPRISE = 'http://localhost:8080/enterprise/export';

    console.log(        {
      gender: this.state.radioIdSelected,
      ageGreaterThan: this.state.ageMin,
      ageLessThan: this.state.ageMax
    });

    axios
      .get(API_URL_ENTREPRISE,
        {
          body: {
            gender: this.state.radioIdSelected,
            ageGreaterThan: this.state.ageMin,
            ageLessThan: this.state.ageMax
          }
        }, config)
      .then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      })

  }

  render() {


    const button = (
      <EuiButton
        fill
        onClick={this.onDownloadClick.bind(this)}
        style={{
          "margin": "0 auto",
          "display": "block"
        }}
      >
        Télécharger le CSV
      </EuiButton>
    );

    const radios = [
      {
        id: 'Homme',
        label: 'Homme',
        name: 'Homme'
      },
      {
        id: 'Femme',
        label: 'Femme',
        name: 'Femme'
      },
      {
        id: 'Les deux',
        label: 'Les deux',
        name: 'Les deux'
      }
    ];

    const onChange = optionId => {
      this.setState({ radioIdSelected: optionId })
    };

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
              <EuiHeaderLink href="/recettes">
                Mes recettes
              </EuiHeaderLink>
              <EuiHeaderLink href="/paniers">
                Mes paniers
              </EuiHeaderLink>
              <EuiHeaderLink href="/consumed">Mes produits consommés</EuiHeaderLink>
                <EuiHeaderLink iconType="help" href="/help">
                Help
      </EuiHeaderLink>
            </EuiHeaderLinks>
          </EuiHeaderSectionItem>
        </EuiHeader>

        <EuiPage>
          <EuiPageBody>
            <EuiPageContent verticalPosition="center" horizontalPosition="center">
              <EuiPageContentHeader>
                <EuiPageContentHeaderSection>
                  <EuiTitle>
                    <h2>Télécharger les données clients</h2>
                  </EuiTitle>
                </EuiPageContentHeaderSection>
              </EuiPageContentHeader>
              <EuiPageContentBody>
                <Fragment>
                  <EuiForm isInvalid={this.state.error.length > 0 || this.state.ageMaxError != null || this.state.ageMinError != null}
                    error={this.state.error}
                  >

                    <EuiFormRow
                      label="Age minimum"
                      isInvalid={this.state.ageMinError != null}
                      error={this.state.ageMinError}
                    >
                      <EuiFieldNumber
                        placeholder="Age minimum"
                        id="ageMin"
                        min={0}
                        max={100}
                        name="ageMin"
                        onChange={(e) => this.onInputChange(e)}
                        aria-label="AgeMin"
                      />
                    </EuiFormRow>

                    <EuiFormRow
                      label="Age maximum"
                      isInvalid={this.state.ageMaxError != null}
                      error={this.state.ageMaxError}
                    >
                      <EuiFieldNumber
                        placeholder="Age maximum"
                        id="ageMax"
                        min={0}
                        max={100}
                        name="ageMax"
                        onChange={(e) => this.onInputChange(e)}
                        aria-label="ageMax"
                      />
                    </EuiFormRow>

                    <EuiFormRow
                      label="Genre"
                    >
                      <EuiRadioGroup
                        options={radios}
                        idSelected={this.state.radioIdSelected}
                        name='gender'
                        id='gender'
                        onChange={id => onChange(id)}
                      />
                    </EuiFormRow>

                    <EuiSpacer />
                    {button}
                    <EuiSpacer />
                  </EuiForm>
                </Fragment>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      </Fragment>
    )
  }
}
