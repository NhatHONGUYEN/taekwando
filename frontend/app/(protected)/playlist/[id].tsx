import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { usePlaylist } from '@/features/playlists/hooks/usePlaylist';
import { useRemoveExerciseFromPlaylist } from '@/features/playlists/hooks/useRemoveExerciseFromPlaylist';
import { useSessionStore } from '@/features/session/store/useSessionStore';
import type { Exercise } from '@/features/exercises/types';
import type { SessionRuntimeItem } from '@/features/session/types/session.types';

const RUN_HREF = '/(protected)/session/run' as Href;

function PlaylistExerciseRow({
  exercise,
  order,
  onRemove,
  isRemoving,
}: {
  exercise: Exercise;
  order: number;
  onRemove: () => void;
  isRemoving: boolean;
}) {
  return (
    <View className="mb-2 flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
      <Text className="mr-3 w-6 text-center text-sm font-bold text-gray-400">{order}</Text>
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{exercise.name}</Text>
        <Text className="text-xs capitalize text-gray-500">
          {exercise.category} · Level {exercise.level} · {exercise.durationSecDefault}s
        </Text>
      </View>
      <TouchableOpacity
        onPress={onRemove}
        disabled={isRemoving}
        className="ml-3 rounded-lg bg-red-50 px-3 py-1.5">
        <Text className="text-xs font-medium text-red-600">{isRemoving ? '...' : 'Remove'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PlaylistDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const startSession = useSessionStore((s) => s.startSession);
  const { data: playlist, isLoading, isError } = usePlaylist(id);
  const {
    mutate: removeExercise,
    isPending,
    variables: removingId,
  } = useRemoveExerciseFromPlaylist(id);

  const handleRemove = (exerciseId: string, exerciseName: string) => {
    Alert.alert('Remove exercise', `Remove "${exerciseName}" from this playlist?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeExercise(exerciseId) },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError || !playlist) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text>Error loading playlist</Text>
      </View>
    );
  }

  const sortedItems = [...playlist.items].sort((a, b) => a.order - b.order);

  const handleStartSession = () => {
    const runtimeItems: SessionRuntimeItem[] = sortedItems.map((item) => {
      const exercise = item.exerciseId as Exercise;
      return {
        exerciseId: exercise._id,
        exerciseName: exercise.name,
        exerciseSlug: exercise.slug,
        targetDurationSec: exercise.durationSecDefault,
        completed: false,
      };
    });
    startSession(runtimeItems);
    router.push(RUN_HREF);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 pb-4 pt-12 shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mb-3">
          <Text className="text-sm font-medium text-gray-500">← Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">{playlist.name}</Text>
        {!!playlist.description && (
          <Text className="mt-1 text-sm text-gray-500">{playlist.description}</Text>
        )}
        <Text className="mt-2 text-sm text-gray-400">
          {playlist.items.length} exercice{playlist.items.length > 1 ? 's' : ''}
        </Text>
        {sortedItems.length > 0 && (
          <TouchableOpacity
            onPress={handleStartSession}
            className="mt-3 items-center rounded-xl bg-gray-900 py-3">
            <Text className="font-semibold text-white">▶ Start session</Text>
          </TouchableOpacity>
        )}
      </View>

      {sortedItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500">No exercises in this playlist yet.</Text>
          <Text className="mt-1 text-center text-sm text-gray-400">
            Go to Exercises and tap "+ Playlist" to add some.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedItems}
          keyExtractor={(item) => (item.exerciseId as Exercise)._id}
          className="px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            const exercise = item.exerciseId as Exercise;
            return (
              <PlaylistExerciseRow
                key={exercise._id}
                exercise={exercise}
                order={item.order}
                onRemove={() => handleRemove(exercise._id, exercise.name)}
                isRemoving={isPending && removingId === exercise._id}
              />
            );
          }}
        />
      )}
    </View>
  );
}
