import { reactive, readonly } from 'vue';
import keycloak from 'src/services/auth/keycloakService';

const state = reactive({
  authenticated: false,
  userProfile: null as Keycloak.KeycloakProfile | null,
});

async function initialize() {
  try {
    await keycloak.init({ onLoad: 'check-sso' });
    state.authenticated = keycloak.authenticated ?? false;

    if (state.authenticated) {
      state.userProfile = await keycloak.loadUserProfile();
    }
  } catch (error) {
    console.error('Erro ao inicializar Keycloak', error);
  }
}

function login() {
  void keycloak.login();
}

function logout() {
  void keycloak.logout();
}

function getToken() {
  return keycloak.token;
}

export function useAuth() {
  return {
    initialize,
    login,
    logout,
    getToken,
    state: readonly(state),
  };
}