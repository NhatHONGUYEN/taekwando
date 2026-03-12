import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePlaylist, type UpdatePlaylistData } from '../api/update-playlist';

export function useUpdatePlaylist() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePlaylistData }) => {
      const token = await getToken();
      return updatePlaylist(id, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}
