import { boot } from 'quasar/wrappers';
import keycloak from 'src/services/keycloakService';
import { initTeacherData } from 'src/services/authService';
import { api } from 'boot/axios';

export default boot(async ({ router }) => {
  try {
    await keycloak.init({ onLoad: 'check-sso' });

    if (keycloak.authenticated) {
      const token = keycloak.token;

      if (!token) {
        console.error('CPF não encontrado no token');
        await router.replace('/unauthorized');
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const isValid = await initTeacherData();

      if (isValid) {
        await router.replace('/home');
        const cleanUrl = window.location.origin + '/home';
        window.history.replaceState({}, document.title, cleanUrl);
      } else {
        await router.replace('/unauthorized');
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar Keycloak', error);
  }

  router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth;
    const isPublic = to.meta.public === true;

    if (requiresAuth && !keycloak.authenticated) {
      void keycloak.login();
    } else if (isPublic && keycloak.authenticated && to.path === '/login') {
      next('/home');
    } else {
      next();
    }
  });
});