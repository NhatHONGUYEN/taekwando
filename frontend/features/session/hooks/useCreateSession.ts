import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSession } from '../api/session.api';
import type { CreateSessionPayload } from '../types/session.types';

export function useCreateSession() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSessionPayload) => {
      const token = await getToken();
      return createSession(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
