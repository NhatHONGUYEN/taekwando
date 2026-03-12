import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeExerciseFromPlaylist } from '../api/remove-exercise-from-playlist';

export function useRemoveExerciseFromPlaylist(playlistId: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciseId: string) => {
      const token = await getToken();
      return removeExerciseFromPlaylist(playlistId, exerciseId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}
