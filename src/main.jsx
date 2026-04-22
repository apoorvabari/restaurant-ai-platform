import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './app/store.js';
import { Auth0Provider } from '@auth0/auth0-react';

// SET THIS TO 'auth0' or 'local'
const AUTH_MODE = "local"; 

// --- Auth0 Config ---
const auth0Config = {
  domain: "dev-qfpyjoooo6px8kqf.jp.auth0.com",
  clientId: "2xNtzXnd9I6lHsGW6GjSTSXv4gs7kZbo",
  authorizationParams: {
    redirect_uri: window.location.origin,
    scope: "openid profile email"
  },
  cacheLocation: "localstorage",
  useRefreshTokens: true
};

// --- Keycloak Config ---
// Integration for Keycloak will be added here using 'keycloak-js' if desired.
// For now, only the Auth0 provider is active when mode is 'auth0'.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {AUTH_MODE === "auth0" ? (
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={auth0Config.authorizationParams}
        cacheLocation={auth0Config.cacheLocation}
        useRefreshTokens={auth0Config.useRefreshTokens}
      >
        <Provider store={store}>
          <App />
        </Provider>
      </Auth0Provider>
    ) : (
      /* Local authentication mode - no Auth0Provider needed */
      <Provider store={store}>
        <App />
      </Provider>
    )}
  </React.StrictMode>
);