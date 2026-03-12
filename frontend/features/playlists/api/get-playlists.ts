import { apiFetch } from '@/lib/api/apiFetch';
import type { Playlist } from '../types';

export async function getPlaylists(token?: string | null): Promise<Playlist[]> {
  return apiFetch<Playlist[]>('/playlists', {
    method: 'GET',
    token,
  });
}
