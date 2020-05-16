import React, { Component, Fragment } from 'react'
import AuthService from '../services/auth-service';
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
  EuiFieldPassword,
  EuiFieldText,
  EuiSpacer,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink
} from '@elastic/eui';

// set up cookies

export default class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: [],
      login: null,
      password: null,
      passwordConfirmation: null,
      loginError: null,
      passwordError: null,
      showLoader: false,
      succesRegister: false
    }
  }

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onLoginClick = (e) => {
    e.preventDefault();
    this.setState({ error: [] });
    this.setState({ loginError: null });
    this.setState({ passwordError: null });

    if (!this.state.login) {
      this.setState({ loginError: 'Login must be filled' })
      this.setState({ error: ['Login must be filled'] })
      return;
    }

    this.setState({ loginError: null })

    if (!this.state.password) {
      this.setState({ passwordError: 'Password can\'t be empty' })
      this.setState({ error: ['Password can\'t be empty'] })
      return;
    }

    if (this.state.password !== this.state.passwordConfirmation) {
      this.setState({ passwordError: 'Password are different' })
      this.setState({ error: ['Password are different'] })
      return;
    }

    if (this.state.password.length < 8) {
      this.setState({ passwordError: 'Password length must be greater or equal than 8' })
      this.setState({ error: ['Password length must be greater or equal than 8'] })
      return;
    }

    this.setState({ passwordError: null })

    this.launchRegisterRequest();
  }

  launchRegisterRequest = async () => {

    /* eslint-disable no-console */
    AuthService.register(
      this.state.login,
      this.state.password
    ).then(
      response => {
        this.setState({
          message: response.data.message,
          succesRegister: true
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          error: resMessage
        });
      }
    );
  }

  render() {

    const button = (
      <EuiButton
        fill
        onClick={this.onLoginClick.bind(this)}
        style={{
          "margin": "0 auto",
          "display": "block"
        }}
      >
        Register
      </EuiButton>
    );

    return (

      <EuiPage>
        <EuiPageBody>
          <EuiPageContent verticalPosition="center" horizontalPosition="center">
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle>
                  <h2>Register</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiPageContentBody>
            {this.state.succesRegister &&
                <Fragment>
                  <EuiCallOut style={{"width": "400px"}} title="Successfully registered !" color="success" iconType="user">
                    <p>
                      You have been successfully registered, you will be redirected to the login page...
                    </p>
                  </EuiCallOut>
                  <EuiSpacer />
                </Fragment>
              }
              <Fragment>
                <EuiForm isInvalid={this.state.error.length > 0 || this.state.loginError != null || this.state.passwordError != null}
                  error={this.state.error}
                >
                  <EuiFormRow
                    label="Login"
                    isInvalid={this.state.loginError != null}
                    error={this.state.loginError}
                    id="test"
                  >
                    <EuiFieldText
                      placeholder="Login"
                      isInvalid={this.state.loginError != null}
                      id="login"
                      name="login"
                      onChange={(e) => this.onInputChange(e)}
                    />
                  </EuiFormRow>

                  <EuiFormRow
                    label="Password"
                    helpText="Password length must be greater or equal than 8, use at least one numeric character too !"
                    isInvalid={this.state.passwordError != null}
                    error={this.state.passwordError}
                  >
                    <EuiFieldPassword
                      placeholder="Password"
                      isInvalid={this.state.passwordError != null}
                      id="password"
                      name="password"
                      onChange={(e) => this.onInputChange(e)}
                    />
                  </EuiFormRow>

                  <EuiFormRow
                    label="Password confirmation"
                    isInvalid={this.state.passwordError != null}
                    error={this.state.passwordError}
                  >
                    <EuiFieldPassword
                      placeholder="Password confirmation"
                      isInvalid={this.state.passwordError != null}
                      id="passwordConfirmation"
                      name="passwordConfirmation"
                      onChange={(e) => this.onInputChange(e)}
                    />
                  </EuiFormRow>

                  <EuiSpacer />
                  {button}
                  <EuiSpacer />
                  <EuiFlexGroup justifyContent="spaceAround">
                    <EuiFlexItem grow={false}>
                      <EuiLink href="/login">
                        Already have an account ? Go to login page !
                  </EuiLink>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiForm>
              </Fragment>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    )
  }
}
