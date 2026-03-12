import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { getPlaylists } from '../api/get-playlists';

export function usePlaylists() {
  const { getToken, isLoaded, userId } = useAuth();

  return useQuery({
    queryKey: ['playlists'],
    enabled: isLoaded && !!userId,
    queryFn: async () => {
      const token = await getToken();
      return getPlaylists(token);
    },
  });
}
