import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { getPlaylist } from '../api/get-playlist';

export function usePlaylist(id: string) {
  const { getToken, isLoaded, userId } = useAuth();

  return useQuery({
    queryKey: ['playlists', id],
    enabled: isLoaded && !!userId && !!id,
    queryFn: async () => {
      const token = await getToken();
      return getPlaylist(id, token);
    },
  });
}
