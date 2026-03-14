import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSession } from '@/features/session/hooks/useSession';
import type { SessionItemPopulated } from '@/features/session/types/session.types';
import type { Exercise } from '@/features/exercises/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function ExerciseRow({ item }: { item: SessionItemPopulated }) {
  const exercise = item.exerciseId as Exercise;
  return (
    <View className="mb-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="font-semibold text-gray-900">{exercise.name}</Text>
        <Text
          className={`text-xs font-medium ${item.completed ? 'text-green-600' : 'text-gray-400'}`}>
          {item.completed ? 'Done' : 'Skipped'}
        </Text>
      </View>
      <View className="flex-row gap-4">
        {item.workSecDone != null && (
          <Text className="text-xs text-gray-500">{formatDuration(item.workSecDone)}</Text>
        )}
        {item.rpe != null && <Text className="text-xs text-gray-500">RPE {item.rpe}</Text>}
        {item.pain?.hip != null && (
          <Text className="text-xs text-gray-500">Hip {item.pain.hip}</Text>
        )}
        {item.pain?.knee != null && (
          <Text className="text-xs text-gray-500">Knee {item.pain.knee}</Text>
        )}
        {item.pain?.lowerBack != null && (
          <Text className="text-xs text-gray-500">Back {item.pain.lowerBack}</Text>
        )}
      </View>
    </View>
  );
}

export default function SessionDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const { data: session, isLoading, isError } = useSession(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading session...</Text>
      </View>
    );
  }

  if (isError || !session) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-gray-500">Session not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-gray-900 px-4 pb-4 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="mb-3">
          <Text className="text-sm text-gray-400">← Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">{formatDate(session.performedAt)}</Text>
        <Text className="mt-1 text-sm text-gray-400">
          {formatDuration(session.durationSec)} · {session.items.length} exercise
          {session.items.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 32 }}>
        {session.notes ? (
          <View className="mb-4 rounded-xl bg-white px-4 py-3">
            <Text className="text-sm text-gray-600">{session.notes}</Text>
          </View>
        ) : null}

        {session.items.map((item, i) => (
          <ExerciseRow key={i} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}
