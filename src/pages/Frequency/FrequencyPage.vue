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

            <q-pagination v-if="filteredDateColumns.length > columnsPerPage" v-model="columnPage"
                :max="Math.ceil(filteredDateColumns.length / columnsPerPage)" color="primary" input boundary-numbers
                class="q-mb-md" />

            <q-table flat bordered :rows="students" :columns="columns" row-key="id" separator="horizontal"
                class="q-table--striped" :table-class="$q.dark.isActive ? 'table-dark' : 'table-light'">
                <template v-slot:top-row>
                    <template v-for="(action, index) in toggleActions" :key="action.label">
                        <q-tr :class="index === 0 ? 'bg-grey-2' : 'bg-grey-3'">
                            <q-th class="text-left text-weight-bold">{{ action.label }}</q-th>
                            <q-th v-for="col in paginatedDateColumns" :key="col" class="text-center">
                                <q-toggle :model-value="action.lockRef.value[col]"
                                    @update:model-value="(val) => action.handler(col, val)" dense
                                    :color="action.lockRef.value[col] ? action.color : ''"
                                    :checked-icon="action.icon" />
                            </q-th>
                            <q-th />
                        </q-tr>
                    </template>
                </template>

                <template v-slot:body-cell="props">
                    <q-td :props="props" :class="props.col.name === 'name' ? 'name-column' : ''">
                        <template v-if="paginatedDateColumns.includes(props.col.name)">
                            <q-select v-model="props.row.frequencies[props.col.name]" :options="attendanceOptions"
                                filled dense emit-value map-options class="frequency-cell"
                                :disable="!props.row.editableFrequencies[props.col.name]"
                                @update:model-value="onManualFrequencyChange(props.col.name)" />
                        </template>
                        <template v-else>
                            {{ props.value }}
                        </template>
                    </q-td>
                </template>
            </q-table>
        </div>
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
    onManualFrequencyChange
} = useFrequencyPage()

onMounted(() => {
    loadStudents()
})
</script>