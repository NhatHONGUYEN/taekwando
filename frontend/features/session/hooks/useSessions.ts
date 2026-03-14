import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { getSessions } from '../api/session.api';

export function useSessions() {
  const { getToken, isLoaded, userId } = useAuth();

  return useQuery({
    queryKey: ['sessions'],
    enabled: isLoaded && !!userId,
    queryFn: async () => {
      const token = await getToken();
      return getSessions(token);
    },
  });
}
