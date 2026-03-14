import { apiFetch } from '@/lib/api/apiFetch';

export async function deleteSession(id: string, token?: string | null): Promise<void> {
  return apiFetch<void>(`/sessions/${id}`, { method: 'DELETE', token });
}
