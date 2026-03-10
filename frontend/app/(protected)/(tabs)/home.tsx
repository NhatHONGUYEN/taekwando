import { View, Text } from 'react-native';
import { useUser } from '@/features/user/hooks/useUser';

export default function HomeScreen() {
  const { data, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading user...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading user</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Welcome {data?.displayName || 'fighter'}</Text>
      <Text>Level: {data?.level}</Text>
    </View>
  );
}
