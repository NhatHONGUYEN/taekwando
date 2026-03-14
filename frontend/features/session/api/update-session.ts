import { apiFetch } from '@/lib/api/apiFetch';
import type { SessionPopulated, CreateSessionPayload } from '../types/session.types';

export async function updateSession(
  id: string,
  payload: Partial<CreateSessionPayload>,
  token?: string | null
): Promise<SessionPopulated> {
  return apiFetch<SessionPopulated>(`/sessions/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}
