<template>
  <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
    <div class="column items-center justify-center">

      <div v-if="teacherOptions.length > 1" class="text-center">
        <div class="text-h6 q-mb-sm">
          {{ hasOwnSchedule
            ? 'Selecione o professor(a) que deseja substituir ou ver seu próprio horário.'
            : 'Selecione o professor(a) que deseja substituir.' }}
        </div>
        <q-select filled v-model="selectedOption" :options="teacherOptions" option-label="label" option-value="value"
          label="Professor(a)" @update:model-value="onTeacherSelect" :error="selectError"
          :error-message="selectErrorMessage" />
      </div>

      <div v-else-if="teacherOptions.length === 1" class="text-h6 text-center">
        Olá, {{ teacherStore.selectedTeacher?.name }}
        <div v-if="teacherStore.selectedTeacher?.holderName !== null" class="text-subtitle2 text-primary">
          Você está substituindo {{ teacherStore.selectedTeacher?.holderName }}
        </div>
      </div>

      <div class="row justify-center q-gutter-lg q-mt-md">
        <q-card v-for="(item, index) in cards" :key="index" class="card-functionality">
          <q-card-section class="column items-center q-pa-xl">
            <q-icon :name="item.icon" size="48px" color="primary" class="q-mb-md" />
            <div class="text-h6 text-center">{{ item.title }}</div>
            <div class="text-body2 text-center q-my-md">
              {{ item.description }}
            </div>
            <q-btn label="ACESSAR" color="primary" @click="goTo(item.route)" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useHomePage } from './HomePage';
import './HomePage.scss';

const {
  teacherOptions,
  selectedOption,
  teacherStore,
  hasOwnSchedule,
  onTeacherSelect,
  goTo,
  cards,
  selectError,
  selectErrorMessage
} = useHomePage();
</script>