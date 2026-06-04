import keycloak from '../config/keycloak';

/**
 * Perform OIDC logout and, after Keycloak finishes, redirect to the
 * SPA's own login page (default '/login').
 *
 * @param {string} loginPath - Route inside the SPA that shows the login UI.
 */
export async function logoutToLoginPage(loginPath = '/login') {
  const base = `${window.location.origin}/restaurant-ai-platform`;
  const postLogoutRedirect = `${base}${loginPath}`;

  // Optional CSRF state token – stored for verification after redirect.
  const state = crypto.randomUUID();
  sessionStorage.setItem('kc_logout_state', state);

  try {
    // keycloak.logout automatically adds id_token_hint.
    await keycloak.logout({
      redirectUri: postLogoutRedirect,
      state,
    });
    return; // Browser navigation performed by the adapter.
  } catch (e) {
    console.warn('keycloak.logout failed, falling back to manual URL', e);
  }

  // Manual fallback – construct the end‑session URL ourselves.
  const endSession = new URL(
    `${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/logout`
  );
  if (keycloak.idToken) {
    endSession.searchParams.append('id_token_hint', keycloak.idToken);
  }
  endSession.searchParams.append('post_logout_redirect_uri', postLogoutRedirect);
  endSession.searchParams.append('state', state);

  // Redirect the browser.
  window.location.href = endSession.toString();
}
