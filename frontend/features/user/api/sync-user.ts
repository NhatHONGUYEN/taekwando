import { apiFetch } from '@/lib/api/apiFetch';
import type { User } from '../types';

export async function syncUser(token: string): Promise<User> {
  return apiFetch<User>('/users/sync', {
    method: 'POST',
    token,
  });
}
