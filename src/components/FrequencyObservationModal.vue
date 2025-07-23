<template>
  <q-dialog v-model="internalModelValue" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Observações do Aluno</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <q-card-section v-if="observations.length">
        <div v-for="(obs, index) in observations" :key="index" class="q-mb-md">
          <div><strong>Início:</strong> {{ formatDate(obs.start) }}</div>
          <div><strong>Fim:</strong> {{ formatDate(obs.end) }}</div>
          <div><strong>Observação:</strong> {{ obs.text }}</div>
          <q-separator class="q-my-sm" v-if="index < observations.length - 1" />
        </div>
      </q-card-section>

      <q-card-section v-else class="text-grey">
        Nenhuma observação registrada.
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps<{
  modelValue: boolean
  observations: { start: string; end: string; text: string }[]
}>()

const internalModelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

function close() {
  emit('update:modelValue', false)
}

function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR')
}
</script>
