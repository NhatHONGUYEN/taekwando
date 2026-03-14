import { apiFetch } from '@/lib/api/apiFetch';
import type { PaginatedExercises } from '../types';

export type GetExercisesParams = {
  category?: string;
  level?: number;
  focus?: string | string[];
  equipment?: string | string[];
  page?: number;
  limit?: number;
};

export async function getExercises(
  params?: GetExercisesParams,
  token?: string | null
): Promise<PaginatedExercises> {
  const query = new URLSearchParams();

  if (params?.category) query.set('category', params.category);
  if (params?.level != null) query.set('level', String(params.level));
  if (params?.page != null) query.set('page', String(params.page));
  if (params?.limit != null) query.set('limit', String(params.limit));

  for (const val of [params?.focus].flat().filter(Boolean) as string[]) {
    query.append('focus', val);
  }
  for (const val of [params?.equipment].flat().filter(Boolean) as string[]) {
    query.append('equipment', val);
  }

  const endpoint = `/exercises${query.toString() ? `?${query.toString()}` : ''}`;
  return apiFetch<PaginatedExercises>(endpoint, { method: 'GET', token });
}
