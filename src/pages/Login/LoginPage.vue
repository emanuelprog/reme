<template>
  <q-page class="flex flex-center bg-primary">
    <q-card class="q-pa-md q-pa-xl-md shadow-2" style="width: 90vw; max-width: 600px; border-radius: 12px;">
      <q-card-section class="column items-center">
        <q-img :src="portalImg" style="width: 150px; height: 150px" class="q-mb-md" fit="contain" />

        <div class="text-subtitle1 text-center q-mb-sm">
          Bem-vindo ao Portal da REME.
        </div>
        <div class="text-body2 text-center q-mb-lg">
          Espaço dedicado aos professores da Rede Municipal de Ensino de Campo Grande.
        </div>

        <q-btn label="ACESSAR" color="primary" class="full-width q-mb-md" @click="login" />

        <div class="text-caption text-center text-grey q-mt-md">
          Desenvolvido pela AGETEC · Prefeitura de Campo Grande
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useLoginPage } from './LoginPage';
import portalImg from 'src/assets/img/portal_professor.png';
import './LoginPage.scss';

const { login } = useLoginPage();
</script>
