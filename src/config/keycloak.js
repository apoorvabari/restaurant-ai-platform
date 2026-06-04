import Keycloak from 'keycloak-js';

// Only url, realm, and clientId are valid Keycloak constructor options.
// redirectUri belongs in initOptions (see main.jsx), NOT here.
const keycloakConfig = {
  url: 'http://localhost:8180',
  realm: 'restaurant-realm',
  clientId: 'restaurant-frontend',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;