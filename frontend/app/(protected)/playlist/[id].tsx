import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { ArrowLeft, Share2, Play, Pencil, Trash2, Clock } from 'lucide-react-native';
import { usePlaylist } from '@/features/playlists/hooks/usePlaylist';
import { useRemoveExerciseFromPlaylist } from '@/features/playlists/hooks/useRemoveExerciseFromPlaylist';
import { useDeletePlaylist } from '@/features/playlists/hooks/useDeletePlaylist';
import { useSessionStore } from '@/features/session/store/useSessionStore';
import { EditPlaylistModal } from '@/features/playlists/components/EditPlaylistModal';
import type { Exercise } from '@/features/exercises/types';
import type { Playlist } from '@/features/playlists/types';
import type { SessionRuntimeItem } from '@/features/session/types/session.types';

const RUN_HREF = '/(protected)/session/run' as Href;
const EXERCISES_HREF = '/(protected)/(tabs)/exercises' as Href;
const PLACEHOLDER = 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800';

function ExerciseRow({
  exercise,
  onRemove,
  isRemoving,
}: {
  exercise: Exercise;
  order: number;
  onRemove: () => void;
  isRemoving: boolean;
}) {
  const mins = Math.max(1, Math.round(exercise.durationSecDefault / 60));
  return (
    <View className="border-tkd-border mx-5 flex-row items-center gap-3 border-b py-3">
      <Image
        source={{ uri: exercise.image?.url ?? PLACEHOLDER }}
        className="h-18 w-18 rounded-xl"
        style={{ width: 72, height: 72 }}
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="mb-1 text-[15px] font-bold text-white">{exercise.name}</Text>
        <Text className="text-xs text-gray-500">
          {exercise.shortDescription || exercise.category}
        </Text>
      </View>
      <Text className="text-brand mr-2 text-[13px] font-bold">{mins} min</Text>
      <TouchableOpacity onPress={onRemove} disabled={isRemoving} hitSlop={8}>
        <Text className={isRemoving ? 'text-gray-600' : 'text-red-500'} style={{ fontSize: 16 }}>
          ✕
        </Text>
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
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();
  const [editing, setEditing] = useState(false);

  const handleRemove = (exerciseId: string, exerciseName: string) => {
    Alert.alert('Remove exercise', `Remove "${exerciseName}" from this playlist?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeExercise(exerciseId) },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Delete playlist', `Delete "${playlist?.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deletePlaylist(id, { onSuccess: () => router.back() }),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="bg-tkd-bg flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  if (isError || !playlist) {
    return (
      <View className="bg-tkd-bg flex-1 items-center justify-center">
        <Text className="text-gray-500">Playlist not found.</Text>
      </View>
    );
  }

  const sortedItems = [...playlist.items].sort((a, b) => a.order - b.order);
  const totalMins = sortedItems.reduce((acc, item) => {
    const ex = item.exerciseId as Exercise;
    return acc + Math.max(1, Math.round(ex.durationSecDefault / 60));
  }, 0);
  const coverUrl =
    sortedItems.length > 0
      ? ((sortedItems[0].exerciseId as Exercise).image?.url ?? PLACEHOLDER)
      : PLACEHOLDER;

  const handleStartSession = () => {
    const runtimeItems: SessionRuntimeItem[] = sortedItems.map((item) => {
      const exercise = item.exerciseId as Exercise;
      return {
        exerciseId: exercise._id,
        exerciseName: exercise.name,
        exerciseSlug: exercise.slug,
        targetDurationSec: exercise.durationSecDefault,
        exerciseImage: exercise.image?.url,
        shortDescription: exercise.shortDescription,
        tip: exercise.safetyNotes?.[0] ?? exercise.instructions?.[0],
        completed: false,
      };
    });
    startSession(runtimeItems);
    router.push(RUN_HREF);
  };

  return (
    <View className="bg-tkd-bg flex-1">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <EditPlaylistModal
        playlist={editing ? (playlist as unknown as Playlist) : null}
        onClose={() => setEditing(false)}
      />

      <FlatList
        data={sortedItems}
        keyExtractor={(item) => (item.exerciseId as Exercise)._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* ── Hero ── */}
            <View className="h-[300px] bg-black">
              <Image source={{ uri: coverUrl }} className="h-full w-full" resizeMode="cover" />

              {/* Overlay */}
              <View
                className="absolute bottom-0 left-0 right-0 h-[200px] justify-end px-5 pb-5"
                style={{ backgroundColor: 'rgba(13,9,5,0.75)' }}>
                <View className="bg-brand mb-2.5 self-start rounded-full px-3 py-1">
                  <Text className="text-[11px] font-extrabold tracking-widest text-white">
                    {sortedItems.length} EXERCISES
                  </Text>
                </View>
                <Text className="text-[28px] font-black leading-9 text-white">{playlist.name}</Text>
              </View>

              {/* Nav bar */}
              <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-5 pb-3 pt-14">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="h-[38px] w-[38px] items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
                  <ArrowLeft size={18} color="#fff" />
                </TouchableOpacity>
                <Text className="text-base font-bold text-white">Playlist Detail</Text>
                <TouchableOpacity
                  onPress={() => Share.share({ title: playlist.name, message: playlist.name })}
                  className="h-[38px] w-[38px] items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
                  <Share2 size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Description + CTAs ── */}
            <View className="px-5 pb-2 pt-5">
              {!!playlist.description && (
                <Text className="mb-5 text-sm leading-relaxed text-gray-400">
                  {playlist.description}
                </Text>
              )}

              {sortedItems.length > 0 && (
                <TouchableOpacity
                  onPress={handleStartSession}
                  activeOpacity={0.85}
                  className="bg-brand mb-3 h-14 flex-row items-center justify-center gap-2.5 rounded-2xl">
                  <Play size={18} color="#fff" fill="#fff" />
                  <Text className="text-base font-extrabold text-white">Start Playlist</Text>
                </TouchableOpacity>
              )}

              <View className="mb-7 flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setEditing(true)}
                  activeOpacity={0.85}
                  className="border-brand h-[46px] flex-1 flex-row items-center justify-center gap-2 rounded-[14px] border"
                  style={{ backgroundColor: '#3D1A08' }}>
                  <Pencil size={15} color="#E8622A" />
                  <Text className="text-brand text-sm font-bold">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={isDeleting}
                  activeOpacity={0.85}
                  className="border-tkd-border bg-tkd-surface h-[46px] flex-1 flex-row items-center justify-center gap-2 rounded-[14px] border">
                  <Trash2 size={15} color="#9CA3AF" />
                  <Text className="text-sm font-bold text-gray-400">Delete</Text>
                </TouchableOpacity>
              </View>

              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-lg font-extrabold text-white">
                  Exercises ({sortedItems.length})
                </Text>
                <View className="flex-row items-center gap-1">
                  <Clock size={13} color="#6B7280" />
                  <Text className="text-[13px] text-gray-500">Total: {totalMins} min</Text>
                </View>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View className="items-center px-8 pt-10">
            <Text className="mb-5 text-center leading-5 text-gray-500">
              No exercises in this playlist yet.
            </Text>
            <TouchableOpacity
              onPress={() => router.navigate(EXERCISES_HREF)}
              activeOpacity={0.85}
              className="bg-brand rounded-2xl px-6 py-3">
              <Text className="font-bold text-white">Browse Exercises</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const exercise = item.exerciseId as Exercise;
          return (
            <ExerciseRow
              exercise={exercise}
              order={item.order}
              onRemove={() => handleRemove(exercise._id, exercise.name)}
              isRemoving={isPending && removingId === exercise._id}
            />
          );
        }}
      />
    </View>
  );
}
