import keycloak from 'src/services/keycloakService';

export function useUnauthorizedPage() {
  function goToLogin() {
    void keycloak.logout({
      redirectUri: window.location.origin + '/login'
    });
  }

  return { goToLogin };
}