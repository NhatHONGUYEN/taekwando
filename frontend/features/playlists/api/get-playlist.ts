import { apiFetch } from '@/lib/api/apiFetch';
import type { PlaylistPopulated } from '../types';

export async function getPlaylist(id: string, token?: string | null): Promise<PlaylistPopulated> {
  return apiFetch<PlaylistPopulated>(`/playlists/${id}`, { method: 'GET', token });
}
