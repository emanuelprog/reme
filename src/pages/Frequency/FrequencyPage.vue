<template>
  <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
    <div class="column items-center">
      <div class="text-h6 text-center q-my-lg">Criação de Frequência</div>

      <div class="row justify-center q-gutter-sm q-mb-md items-center">
        <q-input v-model="dateRangeText" label="Período" outlined dense readonly style="width: 300px">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dateRange" mask="YYYY-MM-DD" range color="primary" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-btn label="Limpar" color="warning" dense @click="onClearDateFilter" />
      </div>

      <q-spinner v-if="loading" color="primary" size="40px" class="q-mb-md" />

      <template v-else>
        <template v-if="dataLoaded && students.length">
          <q-pagination v-if="filteredDateColumns.length > columnsPerPage" v-model="columnPage"
            :max="Math.ceil(filteredDateColumns.length / columnsPerPage)" color="primary" input boundary-numbers
            class="q-mb-md" />

          <q-table flat bordered :rows="students" :columns="columns" row-key="id" separator="horizontal"
            class="q-table--striped" :table-class="$q.dark.isActive ? 'table-dark' : 'table-light'">
            <template v-slot:top-row>
              <template v-for="(action) in toggleActions" :key="action.label">
                <q-tr class="toggle-row">
                  <q-th class="text-left text-weight-bold">{{ action.label }}</q-th>
                  <q-th v-for="col in paginatedDateColumns" :key="col" class="text-center">
                    <q-toggle :model-value="action.lockRef.value[col]"
                      @update:model-value="(val) => action.handler(col, val)" dense
                      :color="action.lockRef.value[col] ? action.color : ''" :checked-icon="action.icon" />
                  </q-th>
                  <q-th />
                </q-tr>
              </template>
            </template>

            <template v-slot:body-cell="props">
              <q-td :props="props" :class="props.col.name === 'name' ? 'name-column' : ''">
                <template v-if="paginatedDateColumns.includes(props.col.name)">
                  <q-select v-model="props.row.frequencies[props.col.name]" :options="attendanceOptions" filled dense
                    emit-value map-options class="frequency-cell"
                    :disable="!props.row.editableFrequencies[props.col.name]"
                    @update:model-value="onManualFrequencyChange(props.col.name)" />
                </template>

                <template v-else-if="props.col.name === 'observation'">
                  <q-btn v-if="props.row.hasObservation" flat round dense icon="chat_bubble" color="primary"
                    @click="() => openObservationModal(props.row.id)" />
                </template>

                <template v-else>
                  {{ props.value }}
                </template>
              </q-td>
            </template>
          </q-table>
        </template>

        <template v-else-if="dataLoaded && !students.length">
          <div class="text-grey-8 text-subtitle2 q-mt-md">
            <q-icon name="warning" size="sm" class="q-mr-xs" />
            Nenhum aluno encontrado para o filtro selecionado.
          </div>
        </template>
      </template>
    </div>

    <q-dialog v-model="showObservationModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Observações do Aluno</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showObservationModal = false" />
        </q-card-section>

        <q-card-section v-if="selectedStudentObservations.length">
          <div v-for="(obs, index) in selectedStudentObservations" :key="index" class="q-mb-md">
            <div><strong>Início:</strong> {{ formatDate(obs.start) }}</div>
            <div><strong>Fim:</strong> {{ formatDate(obs.end) }}</div>
            <div><strong>Observação:</strong> {{ obs.text }}</div>
            <q-separator class="q-my-sm" v-if="index < selectedStudentObservations.length - 1" />
          </div>
        </q-card-section>

        <q-card-section v-else class="text-grey">
          Nenhuma observação registrada.
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import './FrequencyPage.scss'
import { onMounted } from 'vue'
import { useFrequencyPage } from './FrequencyPage'

const {
  loading,
  students,
  columns,
  loadStudents,
  attendanceOptions,
  dateRange,
  dateRangeText,
  paginatedDateColumns,
  filteredDateColumns,
  columnPage,
  columnsPerPage,
  onClearDateFilter,
  toggleActions,
  onManualFrequencyChange,
  openObservationModal,
  formatDate,
  showObservationModal,
  selectedStudentObservations,
  dataLoaded
} = useFrequencyPage()

onMounted(async () => {
  await loadStudents()
})
</script>
