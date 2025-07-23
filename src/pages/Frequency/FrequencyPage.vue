<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div class="text-h6 text-center q-my-lg">Frequência</div>

            <div class="row q-col-gutter-md items-center justify-center" style="max-width: 1200px; width: 100%">
                <q-select v-for="(field, key) in selectFields" :key="key" v-model="filters[key]"
                    :options="field.options" :option-label="field.optionLabel" :option-value="field.optionValue"
                    :label="field.label" filled :error="validate && isFieldRequired(key) && !filters[key]"
                    :error-message="`O campo ${field.label} é obrigatório`" class="col-12 col-sm-6 col-md-3" />
            </div>

            <div class="row q-gutter-md justify-center q-my-lg">
                <q-btn label="Pesquisar meus diários" color="primary" @click="onSearch" />
                <q-btn label="Criar diário" color="green" @click="onCreate" />
                <q-btn label="Limpar" color="warning" @click="clearFilters" />
            </div>

            <div class="q-mt-lg" style="width: 100%; max-width: 1200px;">
                <div v-if="loading" class="row justify-center q-my-md">
                    <q-spinner color="primary" size="40px" />
                </div>

                <q-table v-else-if="showTable && $q.screen.gt.xs" flat bordered :rows="diaryGrades" :columns="columns"
                    row-key="id" separator="horizontal"
                    :table-class="$q.dark.isActive ? 'table-dark' : 'table-light'" />

                <div v-else-if="showTable" class="q-gutter-md">
                    <q-card v-for="diary in paginatedCards" :key="diary.id" class="q-pa-md" bordered>
                        <q-card-section>
                            <div class="text-subtitle1"><strong>{{ diary.discipline }}</strong></div>
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="q-pt-md">
                            <div><strong>Etapa:</strong> {{ diary.teachingType }}</div>
                            <div><strong>Escola:</strong> {{ diary.school }}</div>
                            <div><strong>Turma:</strong> {{ diary.grade }}</div>
                            <div><strong>Bimestre:</strong> {{ diary.bimesterPeriod.bimester }}</div>
                            <div><strong>Ano:</strong> {{ diary.createdAt }}</div>
                            <div><strong>Turno:</strong> {{ diary.shift }}</div>
                            <div><strong>Grupo:</strong> {{ diary.group }}</div>
                        </q-card-section>
                    </q-card>

                    <div class="row justify-center q-mt-md">
                        <q-pagination v-model="paginationCards.page"
                            :max="Math.ceil(diaryGrades.length / paginationCards.rowsPerPage)" color="primary" input
                            max-pages="5" boundary-numbers />
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useFrequencyPage } from './FrequencyPage';
import './FrequencyPage.scss';

const {
    filters,
    selectFields,
    validate,
    showTable,
    loading,
    diaryGrades,
    columns,
    paginationCards,
    paginatedCards,
    isFieldRequired,
    onSearch,
    onCreate,
    clearFilters,
    loadSelectOptions
} = useFrequencyPage();

onMounted(loadSelectOptions);
</script>