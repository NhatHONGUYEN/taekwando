import { useQuery } from '@tanstack/react-query';
import { getExerciseBySlug } from '../api/get-exercise';

export function useExercise(slug: string) {
  return useQuery({
    queryKey: ['exercises', slug],
    queryFn: () => getExerciseBySlug(slug),
    enabled: !!slug,
  });
}
