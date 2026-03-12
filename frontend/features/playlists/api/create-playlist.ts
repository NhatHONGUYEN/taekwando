import { apiFetch } from '@/lib/api/apiFetch';
import type { Playlist } from '../types';

export type CreatePlaylistData = {
  name: string;
  description?: string;
  isPublic?: boolean;
};

export async function createPlaylist(
  data: CreatePlaylistData,
  token?: string | null
): Promise<Playlist> {
  return apiFetch<Playlist>('/playlists', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}
