import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/get-user';

export function useUser() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await getToken();

      if (!token) {
        throw new Error('No auth token found');
      }

      return getUser(token);
    },
    enabled: isLoaded && !!isSignedIn,
  });
}
