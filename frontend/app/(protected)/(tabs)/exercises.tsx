import { View, Text, FlatList } from 'react-native';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import { ExerciseCard } from '@/features/exercises/components/ExerciseCard';

export default function ExercisesScreen() {
  const { data, isLoading, isError } = useExercises();

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

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      <Text className="mb-4 text-lg font-bold">Exercises</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ExerciseCard exercise={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
