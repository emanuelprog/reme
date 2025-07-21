<template>
  <q-header class="bg-primary text-white custom-header">
    <q-toolbar>
      <q-btn dense flat round icon="home" aria-label="Home" to="/home" class="q-mr-sm" />
      <q-toolbar-title class="text-weight-bold">Portal Reme</q-toolbar-title>
      <q-space />
      <q-btn round flat icon="account_circle">
        <q-menu>
          <q-list style="min-width: 200px">
            <q-item exact class="q-dark-fix">
              <q-item-section>
                <div class="text-weight-medium">{{ userName }}</div>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable to="/config" exact class="q-dark-fix">
              <q-item-section avatar><q-icon name="settings" /></q-item-section>
              <q-item-section>Configurações</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="logout" exact class="q-dark-fix">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Sair</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import keycloak from 'src/services/auth/keycloakService';

const $q = useQuasar();

const userName = computed(() => keycloak.tokenParsed?.name + ' ' + keycloak.tokenParsed?.lastName || 'Usuário');

function logout() {
  let seconds = 2;
  const notif = $q.notify({
    group: false,
    timeout: 0,
    message: `Sua sessão será encerrada em ${seconds}...`,
    type: 'info',
    position: 'top-right',
    classes: 'my-notify'
  });

  const interval = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      notif({ message: `Sua sessão será encerrada em ${seconds}...` });
    } else {
      clearInterval(interval);
      notif();
      void keycloak.logout({ redirectUri: window.location.origin + '/login' });
    }
  }, 1000);
}
</script>