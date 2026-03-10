import { apiFetch } from '@/lib/api/apiFetch';
import type { User } from '../types';

export async function getUser(token: string): Promise<User> {
  return apiFetch<User>('/users', {
    method: 'GET',
    token,
  });
}
