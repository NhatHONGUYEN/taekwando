import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useUser } from '@/features/user/hooks/useUser';
import { useSessions } from '@/features/session/hooks/useSessions';
import { usePlaylists } from '@/features/playlists/hooks/usePlaylists';

const PLAYLISTS_HREF = '/(protected)/(tabs)/playlists' as Href;
const SESSIONS_HREF = '/(protected)/(tabs)/sessions' as Href;
const EXERCISES_HREF = '/(protected)/(tabs)/exercises' as Href;

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  return m > 0 ? `${m} min` : `${sec}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: sessions } = useSessions();
  const { data: playlists } = usePlaylists();

  const lastSession = sessions?.[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="bg-gray-900 px-4 pb-6 pt-14">
        <Text className="text-sm text-gray-400">{greeting}</Text>
        <Text className="mt-1 text-2xl font-bold text-white">
          {user?.displayName || 'Fighter'} 👊
        </Text>
        {user && (
          <View className="mt-3 self-start rounded-full bg-gray-700 px-3 py-1">
            <Text className="text-xs font-medium text-gray-200">Level {user.level}</Text>
          </View>
        )}
      </View>

      <View className="px-4 pt-5">
        {/* Last session */}
        <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Last session
        </Text>
        {lastSession ? (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(protected)/session/[id]',
                params: { id: lastSession._id },
              } as Href)
            }
            className="mb-5 rounded-xl border border-gray-200 bg-white px-4 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-gray-900">
                {formatDate(lastSession.performedAt)}
              </Text>
              <Text className="text-sm text-gray-500">
                {formatDuration(lastSession.durationSec)}
              </Text>
            </View>
            <Text className="mt-1 text-sm text-gray-500">
              {lastSession.items.length} exercise{lastSession.items.length !== 1 ? 's' : ''}
              {lastSession.notes ? ` · ${lastSession.notes}` : ''}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="mb-5 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-5">
            <Text className="text-center text-sm text-gray-400">No sessions yet.</Text>
            <Text className="mt-1 text-center text-xs text-gray-400">
              Open a playlist to start your first session.
            </Text>
          </View>
        )}

        {/* Quick actions */}
        <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Quick actions
        </Text>
        <View className="mb-5 flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.navigate(PLAYLISTS_HREF)}
            className="flex-1 items-center rounded-xl bg-gray-900 py-4">
            <Text className="text-lg">📋</Text>
            <Text className="mt-1 text-xs font-semibold text-white">Playlists</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.navigate(EXERCISES_HREF)}
            className="flex-1 items-center rounded-xl bg-gray-900 py-4">
            <Text className="text-lg">🥋</Text>
            <Text className="mt-1 text-xs font-semibold text-white">Exercises</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.navigate(SESSIONS_HREF)}
            className="flex-1 items-center rounded-xl bg-gray-900 py-4">
            <Text className="text-lg">📈</Text>
            <Text className="mt-1 text-xs font-semibold text-white">History</Text>
          </TouchableOpacity>
        </View>

        {/* Your playlists */}
        {playlists && playlists.length > 0 && (
          <>
            <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Your playlists
            </Text>
            {playlists.slice(0, 3).map((playlist) => (
              <TouchableOpacity
                key={playlist._id}
                onPress={() =>
                  router.push({
                    pathname: '/(protected)/playlist/[id]',
                    params: { id: playlist._id },
                  })
                }
                className="mb-2 flex-row items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
                <Text className="font-medium text-gray-900">{playlist.name}</Text>
                <Text className="text-sm text-gray-400">{playlist.items.length} ex.</Text>
              </TouchableOpacity>
            ))}
            {playlists.length > 3 && (
              <TouchableOpacity onPress={() => router.navigate(PLAYLISTS_HREF)}>
                <Text className="mt-1 text-center text-sm text-gray-400">
                  +{playlists.length - 3} more
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
