import { useQuery } from '@tanstack/react-query';
import { getExercises, type GetExercisesParams } from '../api/get-exercises';

export function useExercises(params?: GetExercisesParams) {
  return useQuery({
    queryKey: ['exercises', params],
    queryFn: () => getExercises(params),
  });
}
