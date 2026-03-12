import { apiFetch } from '@/lib/api/apiFetch';
import type { Playlist } from '../types';

export type UpdatePlaylistData = {
  name?: string;
  description?: string;
  isPublic?: boolean;
};

export async function updatePlaylist(
  id: string,
  data: UpdatePlaylistData,
  token?: string | null
): Promise<Playlist> {
  return apiFetch<Playlist>(`/playlists/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  });
}
