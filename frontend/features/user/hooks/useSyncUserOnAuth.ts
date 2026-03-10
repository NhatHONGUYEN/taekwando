import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useRef } from 'react';
import { useSyncUser } from './useSyncUser';

export function useSyncUserOnAuth() {
  const { isLoaded, isSignedIn } = useAuth();
  const { mutateAsync, isPending, isError, error } = useSyncUser();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    async function sync() {
      if (!isLoaded || !isSignedIn || hasSyncedRef.current) {
        return;
      }

      try {
        hasSyncedRef.current = true;
        await mutateAsync();
      } catch (err) {
        hasSyncedRef.current = false;
        console.error('Failed to sync user:', err);
      }
    }

    sync();
  }, [isLoaded, isSignedIn, mutateAsync]);

  return {
    isReady: isLoaded && isSignedIn && hasSyncedRef.current && !isPending,
    isPending,
    isError,
    error,
  };
}
