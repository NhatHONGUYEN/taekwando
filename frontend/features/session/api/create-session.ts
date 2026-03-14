import { apiFetch } from '@/lib/api/apiFetch';
import type { Session, CreateSessionPayload } from '../types/session.types';

export async function createSession(
  payload: CreateSessionPayload,
  token?: string | null
): Promise<Session> {
  return apiFetch<Session>('/sessions', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}
