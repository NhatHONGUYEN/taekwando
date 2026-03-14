import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import { ExerciseCard } from '@/features/exercises/components/ExerciseCard';
import type { ExerciseCategory } from '@/features/exercises/types';

const LIMIT = 20;

const CATEGORIES: ExerciseCategory[] = ['mobility', 'flexibility', 'strength'];
const LEVELS = [1, 2, 3, 4, 5];

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function Chip({ label, active, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mr-2 rounded-full border px-4 py-1.5 ${
        active ? 'border-transparent bg-gray-900' : 'border-gray-300 bg-white'
      }`}>
      <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-700'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function ExercisesScreen() {
  const [category, setCategory] = useState<ExerciseCategory | undefined>();
  const [level, setLevel] = useState<number | undefined>();
  const [focus, setFocus] = useState<string | undefined>();
  const [equipment, setEquipment] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const resetPage = () => setPage(1);

  const toggleCategory = (value: ExerciseCategory) => {
    setCategory((prev) => (prev === value ? undefined : value));
    resetPage();
  };

  const toggleLevel = (value: number) => {
    setLevel((prev) => (prev === value ? undefined : value));
    resetPage();
  };

  const { data, isLoading, isError } = useExercises({
    category,
    level,
    focus,
    equipment,
    page,
    limit: LIMIT,
  });

  const hasActiveFilters = category !== undefined || level !== undefined;

  const clearFilters = () => {
    setCategory(undefined);
    setLevel(undefined);
    setFocus(undefined);
    setEquipment(undefined);
    resetPage();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text>Loading exercises...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text>Error loading exercises</Text>
      </View>
    );
  }

  const items = data?.items ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <View className="flex-1 bg-gray-50 pt-4">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between px-4">
        <Text className="text-lg font-bold">Exercises</Text>
        {hasActiveFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text className="text-sm text-gray-500">Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2"
        contentContainerStyle={{ paddingHorizontal: 16 }}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat.charAt(0).toUpperCase() + cat.slice(1)}
            active={category === cat}
            onPress={() => toggleCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* Level filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
        contentContainerStyle={{ paddingHorizontal: 16 }}>
        {LEVELS.map((lvl) => (
          <Chip
            key={lvl}
            label={`Level ${lvl}`}
            active={level === lvl}
            onPress={() => toggleLevel(lvl)}
          />
        ))}
      </ScrollView>

      {/* Results count */}
      {data && (
        <Text className="mb-2 px-4 text-xs text-gray-400">
          {data.pagination.total} exercise{data.pagination.total !== 1 ? 's' : ''}
        </Text>
      )}

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ExerciseCard exercise={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-12 items-center">
            <Text className="text-gray-400">No exercises found</Text>
          </View>
        }
        ListFooterComponent={
          page < totalPages ? (
            <TouchableOpacity
              onPress={() => setPage((p) => p + 1)}
              className="my-4 items-center rounded-lg bg-gray-200 py-3">
              <Text className="font-medium text-gray-700">Load more</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}
