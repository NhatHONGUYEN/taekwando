import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSessions } from '@/features/session/hooks/useSessions';
import { useDeleteSession } from '@/features/session/hooks/useDeleteSession';

const PLAYLISTS_HREF = '/(protected)/(tabs)/playlists' as Href;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function SessionsScreen() {
  const router = useRouter();
  const { data: sessions, isLoading, isError } = useSessions();
  const { mutateAsync: deleteSession } = useDeleteSession();

  const handleDelete = (id: string) => {
    Alert.alert('Delete session', 'Are you sure you want to delete this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSession(id);
          } catch {
            Alert.alert('Error', 'Could not delete session.');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading sessions...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading sessions</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pt-12">
      <View className="mb-4 px-4">
        <Text className="text-2xl font-bold text-gray-900">Sessions</Text>
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-16 items-center px-8">
            <Text className="mb-1 text-center text-gray-400">No sessions yet.</Text>
            <Text className="mb-6 text-center text-sm text-gray-400">
              Open a playlist and tap "Start session" to begin.
            </Text>
            <TouchableOpacity
              onPress={() => router.navigate(PLAYLISTS_HREF)}
              className="rounded-xl bg-gray-900 px-6 py-3">
              <Text className="font-semibold text-white">Go to playlists</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: '/(protected)/session/[id]', params: { id: item._id } })
            }
            className="mb-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="font-semibold text-gray-900">{formatDate(item.performedAt)}</Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-sm text-gray-500">{formatDuration(item.durationSec)}</Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                  hitSlop={8}
                  className="rounded-full p-1">
                  <Text className="text-sm text-red-500">✕</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text className="text-sm text-gray-500">
              {item.items.length} exercise{item.items.length !== 1 ? 's' : ''}
              {item.notes ? ` · ${item.notes}` : ''}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
