import { apiFetch } from '@/lib/api/apiFetch';
import type { Exercise } from '../types';

export async function getExerciseBySlug(slug: string): Promise<Exercise> {
  return apiFetch<Exercise>(`/exercises/${slug}`, { method: 'GET' });
}
