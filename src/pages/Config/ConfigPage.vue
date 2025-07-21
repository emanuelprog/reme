<template>
  <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
    <div>
      <div class="text-h6">
        Configurações do Sistema
      </div>
    </div>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Preferências</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-md">
        <q-toggle v-model="tempDarkMode" label="Modo escuro" color="green" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn label="Salvar" color="green" @click="saveSettings" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useConfigPage } from './ConfigPage';
import './ConfigPage.scss';

const { tempDarkMode, saveSettings } = useConfigPage();
</script>