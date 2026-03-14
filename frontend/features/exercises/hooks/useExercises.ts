import { useQuery } from '@tanstack/react-query';
import { getExercises, type GetExercisesParams } from '../api/get-exercises';

export function useExercises(params?: GetExercisesParams) {
  const { category, level, focus, equipment, page, limit } = params ?? {};

  return useQuery({
    queryKey: ['exercises', { category, level, focus, equipment, page, limit }],
    queryFn: () => getExercises(params),
  });
}
