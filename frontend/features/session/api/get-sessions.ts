import { apiFetch } from '@/lib/api/apiFetch';
import type { SessionPopulated } from '../types/session.types';

export async function getSessions(token?: string | null): Promise<SessionPopulated[]> {
  return apiFetch<SessionPopulated[]>('/sessions', { method: 'GET', token });
}
