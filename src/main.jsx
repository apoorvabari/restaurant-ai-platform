import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import App from './App.jsx';
import store from './app/store.js';
import keycloak from './config/keycloak.js';
import './index.css';

const container = document.getElementById('root');
if (!window.__REACT_ROOT__) {
  window.__REACT_ROOT__ = ReactDOM.createRoot(container);
}

const keycloakInitOptions = {
  onLoad: 'login-required',
  checkLoginIframe: false,        // Prevents iframe session checks (stops the master/account iframe error)
  silentCheckSsoFallback: false,  // Prevents fallback iframe that hits /realms/master/account
  pkceMethod: 'S256',
  redirectUri: 'http://localhost:5176/restaurant-ai-platform/',
  flow: 'standard',
};

// NOTE: React.StrictMode is intentionally omitted here.
// Keycloak JS only allows a single init() call per instance.
// StrictMode double-invokes effects in dev, causing:
// "A 'Keycloak' instance can only be initialized once."
window.__REACT_ROOT__.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={keycloakInitOptions}
    onEvent={(event, error) => {
      if (event === 'onAuthSuccess') {
        const token = keycloak.token;
        const parsedToken = keycloak.tokenParsed;
        const roles = parsedToken?.realm_access?.roles || [];

        store.dispatch({
          type: 'auth/setUser',
          payload: {
            user: {
              email: parsedToken?.email,
              name: parsedToken?.given_name,
              preferred_username: parsedToken?.preferred_username,
            },
            token: token,
            roles: roles,
          },
        });

        // axiosConfig reads keycloak.token directly on every request — no manual update needed.
      }
      if (event === 'onAuthLogout') {
        store.dispatch({ type: 'auth/logout' });
      }
      if (event === 'onAuthError' || event === 'onInitError') {
        // This fires if Keycloak server is unreachable or auth fails
        console.error('[Keycloak] Auth/Init error — is Keycloak running on http://localhost:8180?', error);
      }
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ReactKeycloakProvider>
);