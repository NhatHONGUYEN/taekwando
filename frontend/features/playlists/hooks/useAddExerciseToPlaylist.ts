import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addExerciseToPlaylist } from '../api/add-exercise-to-playlist';

export function useAddExerciseToPlaylist() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, exerciseId }: { playlistId: string; exerciseId: string }) => {
      const token = await getToken();
      return addExerciseToPlaylist(playlistId, exerciseId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}
