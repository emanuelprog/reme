import { ref } from 'vue';
import { useQuasar } from 'quasar';

export function useConfigPage() {
  const $q = useQuasar();
  const tempDarkMode = ref($q.dark.isActive);

  function saveSettings() {
    $q.dark.set(tempDarkMode.value);
    $q.notify({
      type: 'positive',
      message: 'Configurações salvas!',
      position: 'top-right',
      timeout: 1000
    });
  }

  return {
    tempDarkMode,
    saveSettings
  };
}