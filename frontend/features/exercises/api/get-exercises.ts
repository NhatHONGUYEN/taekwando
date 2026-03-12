import { apiFetch } from '@/lib/api/apiFetch';
import type { Exercise } from '../types';

export type GetExercisesParams = {
  category?: string;
  level?: number;
};

export async function getExercises(
  params?: GetExercisesParams,
  token?: string | null
): Promise<Exercise[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.level) query.set('level', String(params.level));

  const endpoint = `/exercises${query.toString() ? `?${query.toString()}` : ''}`;
  return apiFetch<Exercise[]>(endpoint, { method: 'GET', token });
}
