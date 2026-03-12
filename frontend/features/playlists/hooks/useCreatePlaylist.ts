import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPlaylist, type CreatePlaylistData } from '../api/create-playlist';

export function useCreatePlaylist() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePlaylistData) => {
      const token = await getToken();
      return createPlaylist(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}
