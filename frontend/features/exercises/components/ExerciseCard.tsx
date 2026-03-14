import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { AddToPlaylistModal } from './AddToPlaylistModal';
import type { Exercise } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  mobility: 'bg-blue-100 text-blue-700',
  flexibility: 'bg-green-100 text-green-700',
  strength: 'bg-orange-100 text-orange-700',
};

type Props = {
  exercise: Exercise;
};

export function ExerciseCard({ exercise }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const categoryStyle = CATEGORY_COLORS[exercise.category] ?? 'bg-gray-100 text-gray-700';

  return (
    <>
      <AddToPlaylistModal
        exercise={modalOpen ? exercise : null}
        onClose={() => setModalOpen(false)}
      />
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/(protected)/exercise/[slug]',
            params: { slug: exercise.slug },
          } as Href)
        }
        className="mb-3 rounded-2xl border border-gray-200 bg-white p-4">
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 text-base font-semibold">{exercise.name}</Text>
          <View className={`ml-2 rounded-full px-2 py-0.5 ${categoryStyle.split(' ')[0]}`}>
            <Text className={`text-xs font-medium ${categoryStyle.split(' ')[1]}`}>
              {exercise.category}
            </Text>
          </View>
        </View>

        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row gap-3">
            <Text className="text-sm text-gray-500">Level {exercise.level}</Text>
            <Text className="text-sm text-gray-500">{exercise.durationSecDefault}s</Text>
            {exercise.focus.length > 0 && (
              <Text className="text-sm text-gray-500">{exercise.focus.join(', ')}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setModalOpen(true)}
            className="rounded-lg bg-black px-3 py-1.5">
            <Text className="text-xs font-medium text-white">+ Playlist</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </>
  );
}
