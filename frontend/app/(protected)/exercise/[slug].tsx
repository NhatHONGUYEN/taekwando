import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useExercise } from '@/features/exercises/hooks/useExercise';

const CATEGORY_COLORS: Record<string, string> = {
  mobility: 'bg-blue-100 text-blue-700',
  flexibility: 'bg-green-100 text-green-700',
  strength: 'bg-orange-100 text-orange-700',
};

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  const [bg, text] = colorClass.split(' ');
  return (
    <View className={`rounded-full px-3 py-1 ${bg}`}>
      <Text className={`text-xs font-medium capitalize ${text}`}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-400">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const router = useRouter();

  const { data: exercise, isLoading, isError } = useExercise(slug);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError || !exercise) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-gray-500">Exercise not found.</Text>
      </View>
    );
  }

  const categoryStyle = CATEGORY_COLORS[exercise.category] ?? 'bg-gray-100 text-gray-700';

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gray-900 px-4 pb-5 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-sm text-gray-400">← Back</Text>
        </TouchableOpacity>

        <View className="mb-2 flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-2xl font-bold text-white">{exercise.name}</Text>
          <Badge label={exercise.category} colorClass={categoryStyle} />
        </View>

        <View className="flex-row gap-4">
          <Text className="text-sm text-gray-400">Level {exercise.level}</Text>
          <Text className="text-sm text-gray-400">{exercise.durationSecDefault}s</Text>
          {exercise.equipment.length > 0 && exercise.equipment[0] !== 'none' && (
            <Text className="text-sm text-gray-400">{exercise.equipment.join(', ')}</Text>
          )}
        </View>

        {exercise.focus.length > 0 && (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {exercise.focus.map((f) => (
              <View key={f} className="rounded-full bg-gray-700 px-3 py-1">
                <Text className="text-xs text-gray-200">{f}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <ScrollView className="flex-1 px-4 pt-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Instructions */}
        {exercise.instructions.length > 0 && (
          <Section title="Instructions">
            {exercise.instructions.map((step, i) => (
              <View key={i} className="mb-2 flex-row gap-3">
                <Text className="w-5 text-sm font-bold text-gray-400">{i + 1}.</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">{step}</Text>
              </View>
            ))}
          </Section>
        )}

        {/* Common mistakes */}
        {exercise.commonMistakes.length > 0 && (
          <Section title="Common mistakes">
            {exercise.commonMistakes.map((m, i) => (
              <View key={i} className="mb-2 flex-row gap-2">
                <Text className="text-sm text-red-400">✕</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">{m}</Text>
              </View>
            ))}
          </Section>
        )}

        {/* Safety notes */}
        {exercise.safetyNotes.length > 0 && (
          <Section title="Safety notes">
            {exercise.safetyNotes.map((n, i) => (
              <View key={i} className="mb-2 flex-row gap-2">
                <Text className="text-sm text-yellow-500">⚠</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">{n}</Text>
              </View>
            ))}
          </Section>
        )}
      </ScrollView>
    </View>
  );
}
