<template>
  <q-header class="bg-primary text-white custom-header">
    <q-toolbar>
      <q-btn dense flat round icon="home" aria-label="Home" to="/home" class="q-mr-sm" />
      <q-toolbar-title class="text-weight-bold">Portal Reme</q-toolbar-title>
      <q-space />
      <q-btn round flat>
        <div class="row items-center no-wrap">
          <q-icon name="account_circle" />
          <q-icon name="arrow_drop_down" size="16px" />
        </div>
        <q-menu>
          <q-list style="min-width: 200px">
            <q-item exact class="q-dark-fix">
              <q-item-section>
                <div class="text-weight-medium">{{ userName }}</div>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="showConfig = true" exact class="q-dark-fix">
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

  <q-dialog v-model="showConfig" persistent>
    <q-card style="min-width: 400px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">Configurações do Sistema</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-h6">Preferências</div>
        <q-toggle v-model="tempDarkMode" label="Modo escuro" color="green" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn label="Salvar" color="green" @click="saveSettings" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import keycloak from 'src/services/keycloakService'
import { useConfigPage } from 'src/pages/Config/ConfigPage'

const $q = useQuasar()
const showConfig = ref(false)
const { tempDarkMode, saveSettings } = useConfigPage()

const userName = computed(() =>
  keycloak.tokenParsed?.name + ' ' + keycloak.tokenParsed?.lastName || 'Usuário'
)

function logout() {
  let seconds = 2
  const notif = $q.notify({
    group: false,
    timeout: 0,
    message: `Sua sessão será encerrada em ${seconds}...`,
    type: 'info',
    position: 'top-right',
    classes: 'my-notify'
  })

  const interval = setInterval(() => {
    seconds--
    if (seconds > 0) {
      notif({ message: `Sua sessão será encerrada em ${seconds}...` })
    } else {
      clearInterval(interval)
      notif()
      void keycloak.logout({ redirectUri: window.location.origin + '/login' })
    }
  }, 1000)
}
</script>