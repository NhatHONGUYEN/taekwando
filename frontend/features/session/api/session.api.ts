import { apiFetch } from '@/lib/api/apiFetch';
import type { Session, SessionPopulated, CreateSessionPayload } from '../types/session.types';

export async function getSessions(token?: string | null): Promise<SessionPopulated[]> {
  return apiFetch<SessionPopulated[]>('/sessions', { method: 'GET', token });
}

export async function getSessionById(id: string, token?: string | null): Promise<SessionPopulated> {
  return apiFetch<SessionPopulated>(`/sessions/${id}`, { method: 'GET', token });
}

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

export async function deleteSession(id: string, token?: string | null): Promise<void> {
  return apiFetch<void>(`/sessions/${id}`, { method: 'DELETE', token });
}
