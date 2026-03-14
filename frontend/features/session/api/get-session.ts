import { apiFetch } from '@/lib/api/apiFetch';
import type { SessionPopulated } from '../types/session.types';

export async function getSessionById(id: string, token?: string | null): Promise<SessionPopulated> {
  return apiFetch<SessionPopulated>(`/sessions/${id}`, { method: 'GET', token });
}
