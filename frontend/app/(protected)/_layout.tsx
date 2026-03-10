import { Slot, Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { View, Text } from 'react-native';
import { useSyncUserOnAuth } from '@/features/user/hooks/useSyncUserOnAuth';

export default function ProtectedLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isReady, isPending, isError } = useSyncUserOnAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  if (isPending || !isReady) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error while syncing user</Text>
      </View>
    );
  }

  return <Slot />;
}
