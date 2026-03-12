import { apiFetch } from '@/lib/api/apiFetch';

export async function removeExerciseFromPlaylist(
  playlistId: string,
  exerciseId: string,
  token?: string | null
): Promise<void> {
  return apiFetch<void>(`/playlists/${playlistId}/exercises/${exerciseId}`, {
    method: 'DELETE',
    token,
  });
}
