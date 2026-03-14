import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Dumbbell, CheckCircle2, XCircle, Zap } from 'lucide-react-native';
import { useSession } from '@/features/session/hooks/useSession';
import type { SessionItemPopulated } from '@/features/session/types/session.types';
import type { Exercise } from '@/features/exercises/types';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800';

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

function ExerciseRow({ item, index }: { item: SessionItemPopulated; index: number }) {
  const exercise = item.exerciseId as Exercise;
  const hasPain = item.pain?.hip != null || item.pain?.knee != null || item.pain?.lowerBack != null;

  return (
    <View
      className="bg-tkd-surface border-tkd-border mb-3 overflow-hidden rounded-2xl border"
      style={{ flexDirection: 'row' }}>
      {/* Thumbnail */}
      <Image
        source={{ uri: exercise.image?.url ?? PLACEHOLDER }}
        style={{ width: 80, height: 80 }}
        resizeMode="cover"
      />

      {/* Content */}
      <View className="flex-1 px-3 py-3">
        {/* Name + status */}
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="flex-1 pr-2 text-[14px] font-bold text-white" numberOfLines={1}>
            {exercise.name}
          </Text>
          <View
            className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${
              item.completed ? 'bg-green-900' : 'bg-gray-800'
            }`}>
            {item.completed ? (
              <CheckCircle2 size={11} color="#4ade80" />
            ) : (
              <XCircle size={11} color="#6B7280" />
            )}
            <Text
              className={`text-[10px] font-bold ${
                item.completed ? 'text-green-400' : 'text-gray-500'
              }`}>
              {item.completed ? 'DONE' : 'SKIPPED'}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View className="flex-row flex-wrap gap-x-3 gap-y-1">
          {item.workSecDone != null && (
            <View className="flex-row items-center gap-1">
              <Clock size={11} color="#6B7280" />
              <Text className="text-[11px] text-gray-500">{formatDuration(item.workSecDone)}</Text>
            </View>
          )}
          {item.rpe != null && (
            <View className="flex-row items-center gap-1">
              <Zap size={11} color="#E8622A" />
              <Text className="text-brand text-[11px] font-bold">RPE {item.rpe}</Text>
            </View>
          )}
          {item.pain?.hip != null && (
            <Text className="text-[11px] text-gray-500">Hip {item.pain.hip}</Text>
          )}
          {item.pain?.knee != null && (
            <Text className="text-[11px] text-gray-500">Knee {item.pain.knee}</Text>
          )}
          {item.pain?.lowerBack != null && (
            <Text className="text-[11px] text-gray-500">Back {item.pain.lowerBack}</Text>
          )}
          {!item.workSecDone && !item.rpe && !hasPain && (
            <Text className="text-[11px] text-gray-600">No data recorded</Text>
          )}
        </View>
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
      <View className="bg-tkd-bg flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading session...</Text>
      </View>
    );
  }

  if (isError || !session) {
    return (
      <View className="bg-tkd-bg flex-1 items-center justify-center px-6">
        <Text className="text-gray-500">Session not found.</Text>
      </View>
    );
  }

  const completed = session.items.filter((i) => i.completed).length;
  const totalMins = Math.round(session.durationSec / 60);

  return (
    <View className="bg-tkd-bg flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#0D0905" />

      {/* ── Header ── */}
      <View className="px-5 pb-4 pt-14">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4 h-9 w-9 items-center justify-center"
          hitSlop={8}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>

        <Text className="text-brand mb-0.5 text-[11px] font-extrabold uppercase tracking-widest">
          Session Summary
        </Text>
        <Text className="mb-4 text-[22px] font-black text-white">
          {formatDate(session.performedAt)}
        </Text>

        {/* Stat chips */}
        <View className="flex-row gap-3">
          <View className="bg-tkd-surface border-tkd-border flex-1 items-center rounded-2xl border py-3">
            <Clock size={18} color="#E8622A" />
            <Text className="text-brand mt-1 text-[16px] font-black">{totalMins}</Text>
            <Text className="text-[10px] uppercase tracking-wide text-gray-600">min</Text>
          </View>
          <View className="bg-tkd-surface border-tkd-border flex-1 items-center rounded-2xl border py-3">
            <Dumbbell size={18} color="#E8622A" />
            <Text className="text-brand mt-1 text-[16px] font-black">{session.items.length}</Text>
            <Text className="text-[10px] uppercase tracking-wide text-gray-600">exercises</Text>
          </View>
          <View className="bg-tkd-surface border-tkd-border flex-1 items-center rounded-2xl border py-3">
            <CheckCircle2 size={18} color="#4ade80" />
            <Text className="mt-1 text-[16px] font-black text-green-400">{completed}</Text>
            <Text className="text-[10px] uppercase tracking-wide text-gray-600">completed</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {/* Notes */}
        {!!session.notes && (
          <View className="bg-tkd-surface border-tkd-border mb-4 rounded-2xl border px-4 py-3">
            <Text className="text-brand mb-1 text-[10px] font-extrabold uppercase tracking-widest">
              Notes
            </Text>
            <Text className="text-sm leading-5 text-gray-400">{session.notes}</Text>
          </View>
        )}

        {/* Section header */}
        <Text className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-gray-600">
          Exercises ({session.items.length})
        </Text>

        {session.items.map((item, i) => (
          <ExerciseRow key={i} item={item} index={i} />
        ))}
      </ScrollView>
    </View>
  );
}