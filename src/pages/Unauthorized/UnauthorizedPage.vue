<template>
  <q-page class="flex flex-center bg-primary">
    <q-card class="q-pa-md q-pa-xl-md shadow-2" style="width: 90vw; max-width: 600px; border-radius: 12px;">
      <q-card-section class="column items-center">
        <q-img :src="portalImg" style="width: 150px; height: 150px" class="q-mb-md" fit="contain" />

        <div class="text-subtitle1 text-center text-negative q-mb-sm">
          Acesso não permitido
        </div>

        <div class="text-body2 text-center q-mb-lg">
          Não foi possível localizar o seu cadastro de professor ou ele está inativo. <br />
          Por favor, entre em contato com o seu coordenador!
        </div>

        <q-icon name="warning" size="100px" color="red" class="q-mb-lg" />

        <q-btn label="VOLTAR AO LOGIN" color="grey-8" class="full-width q-mb-md" @click="goToLogin" />

        <div class="text-caption text-center text-grey q-mt-md">
          Desenvolvido pela AGETEC · Prefeitura de Campo Grande
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useUnauthorizedPage } from './UnauthorizedPage';
import portalImg from 'src/assets/img/portal_professor.png';
import './UnauthorizedPage.scss';

const { goToLogin } = useUnauthorizedPage();
</script>