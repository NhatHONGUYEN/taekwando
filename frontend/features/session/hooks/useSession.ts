import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { getSessionById } from '../api/get-session';

export function useSession(id: string) {
  const { getToken, isLoaded, userId } = useAuth();

  return useQuery({
    queryKey: ['sessions', id ?? ''],
    enabled: isLoaded && !!userId && !!id,
    queryFn: async () => {
      const token = await getToken();
      return getSessionById(id, token);
    },
  });
}
