import { apiFetch } from '@/lib/api/apiFetch';
import type { User } from '../types';

export type UpdateUserPayload = {
  displayName?: string;
  level?: number;
  goals?: string[];
};

export async function updateUser(payload: UpdateUserPayload, token: string): Promise<User> {
  return apiFetch<User>('/users', {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}
