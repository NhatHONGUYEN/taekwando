import { apiFetch } from '@/lib/api/apiFetch';

export async function deletePlaylist(id: string, token?: string | null): Promise<void> {
  return apiFetch<void>(`/playlists/${id}`, {
    method: 'DELETE',
    token,
  });
}
