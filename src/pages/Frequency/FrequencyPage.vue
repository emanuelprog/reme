<script setup lang="ts">
import { useDiaryGradeStore } from 'src/stores/diaryStore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const diaryStore = useDiaryGradeStore();

onMounted(() => {
    if (!diaryStore.selectedDiaryGrade) {
        void router.push('/selection-frequency');
    }
});
</script>

<template>
    <div>
        <h1>Criação de Frequência</h1>
        <pre>{{ diaryStore.selectedDiaryGrade }}</pre>
    </div>
</template>
