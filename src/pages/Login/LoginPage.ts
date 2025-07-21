import { useAuth } from 'src/composables/useAuth';

export function useLoginPage() {
  const { login } = useAuth();
  return { login };
}