<template>
    <q-dialog v-model="show">
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
import { ref } from 'vue'
import { useConfigPage } from 'src/pages/Config/ConfigPage';

const show = ref(false)
const { tempDarkMode, saveSettings } = useConfigPage()

defineExpose({ show })
</script>