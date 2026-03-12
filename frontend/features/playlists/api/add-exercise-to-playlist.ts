import { apiFetch } from '@/lib/api/apiFetch';
import type { Playlist } from '@/features/playlists/types';

export async function addExerciseToPlaylist(
  playlistId: string,
  exerciseId: string,
  token?: string | null
): Promise<Playlist> {
  return apiFetch<Playlist>(`/playlists/${playlistId}/exercises`, {
    method: 'POST',
    token,
    body: JSON.stringify({ exerciseId }),
  });
}
