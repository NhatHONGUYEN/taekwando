import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StatusBar } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { X, SkipBack, SkipForward, Pause, Play } from 'lucide-react-native';
import { useSessionStore } from '@/features/session/store/useSessionStore';
import { useCreateSession } from '@/features/session/hooks/useCreateSession';
import { mapRuntimeToPayload } from '@/features/session/utils/session.mapper';

const SESSIONS_HREF = '/(protected)/(tabs)/sessions' as Href;
const PLACEHOLDER = 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800';

export default function RunSessionScreen() {
  const router = useRouter();
  const { mutateAsync: saveSession, isPending: isSaving } = useCreateSession();

  const {
    items,
    currentIndex,
    status,
    secondsLeft,
    startedAt,
    tick,
    pauseSession,
    resumeSession,
    nextExercise,
    previousExercise,
    finishSession,
    resetSession,
  } = useSessionStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, tick]);

  if (status === 'idle' || items.length === 0) {
    return (
      <View className="bg-tkd-bg flex-1 items-center justify-center px-6">
        <Text className="mb-6 text-center text-gray-500">No session started.</Text>
        <TouchableOpacity
          onPress={() => router.replace(SESSIONS_HREF)}
          className="bg-brand rounded-2xl px-6 py-3">
          <Text className="font-bold text-white">Go to history</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentItem = items[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === items.length - 1;

  const mins = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');
  const progress = (currentIndex + 1) / items.length;

  const handleFinish = () => {
    Alert.alert('Finish session?', 'Save and close this session.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Finish',
        onPress: async () => {
          finishSession();
          const payload = mapRuntimeToPayload(items, startedAt!, new Date());
          try {
            await saveSession(payload);
            resetSession();
            router.replace(SESSIONS_HREF);
          } catch {
            Alert.alert('Error', 'Could not save session. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View className="bg-tkd-bg flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#0D0905" />

      {/* ── Header ── */}
      <View className="flex-row items-center justify-between px-5 pb-3 pt-14">
        <TouchableOpacity
          onPress={handleFinish}
          hitSlop={8}
          className="h-9 w-9 items-center justify-center">
          <X size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-white">Taekwondo Session</Text>
        <View className="w-9" />
      </View>

      {/* ── Exercise label + progress bar ── */}
      <View className="px-5 pb-3">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-brand text-[11px] font-extrabold uppercase tracking-widest">
            {currentItem.exerciseName}
          </Text>
          <Text className="text-xs text-gray-500">
            Exercise {currentIndex + 1} of {items.length}
          </Text>
        </View>
        <View className="bg-tkd-surface h-[5px] w-full overflow-hidden rounded-full">
          <View
            className="bg-brand h-full rounded-full"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </View>
      </View>

      {/* ── Hero image with tip overlay ── */}
      <View className="bg-black" style={{ height: 230 }}>
        <Image
          source={{ uri: currentItem.exerciseImage ?? PLACEHOLDER }}
          className="h-full w-full"
          resizeMode="cover"
        />
        {!!currentItem.tip && (
          <View
            className="absolute bottom-4 left-4 right-16 flex-row items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
            style={{ backgroundColor: 'rgba(58,22,5,0.90)' }}>
            <Text style={{ fontSize: 16 }}>💡</Text>
            <Text className="flex-1 text-[13px] font-medium leading-[18px] text-white">
              {currentItem.tip}
            </Text>
          </View>
        )}
      </View>

      {/* ── Exercise name & description ── */}
      <View className="items-center px-6 pb-1 pt-5">
        <Text className="mb-1.5 text-center text-[26px] font-black text-white">
          {currentItem.exerciseName}
        </Text>
        {!!currentItem.shortDescription && (
          <Text className="text-center text-[13px] leading-5 text-gray-500">
            {currentItem.shortDescription}
          </Text>
        )}
      </View>

      {/* ── Timer ── */}
      <View className="items-center py-5">
        <View className="flex-row items-center gap-3">
          {/* Minutes tile */}
          <View className="items-center">
            <View
              className="bg-tkd-surface items-center justify-center rounded-2xl"
              style={{ width: 112, height: 100 }}>
              <Text className="text-[52px] font-bold tabular-nums text-white">{mins}</Text>
            </View>
            <Text className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
              minutes
            </Text>
          </View>

          {/* Colon separator */}
          <Text className="text-brand mb-5 text-[44px] font-black leading-none">:</Text>

          {/* Seconds tile */}
          <View className="items-center">
            <View
              className="bg-tkd-surface items-center justify-center rounded-2xl"
              style={{ width: 112, height: 100 }}>
              <Text className="text-[52px] font-bold tabular-nums text-white">{secs}</Text>
            </View>
            <Text className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
              seconds
            </Text>
          </View>
        </View>
      </View>

      {/* ── Transport controls ── */}
      <View className="flex-row items-center justify-center gap-8 py-4">
        {/* Previous */}
        <TouchableOpacity
          onPress={previousExercise}
          disabled={isFirst}
          className="h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: '#1A1008', opacity: isFirst ? 0.35 : 1 }}>
          <SkipBack size={22} color="#fff" fill="#fff" />
        </TouchableOpacity>

        {/* Play / Pause */}
        <TouchableOpacity
          onPress={status === 'running' ? pauseSession : resumeSession}
          activeOpacity={0.85}
          className="bg-brand h-[72px] w-[72px] items-center justify-center rounded-full"
          style={{ shadowColor: '#E8622A', shadowOpacity: 0.55, shadowRadius: 18, elevation: 8 }}>
          {status === 'running' ? (
            <Pause size={30} color="#fff" fill="#fff" />
          ) : (
            <Play size={30} color="#fff" fill="#fff" />
          )}
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          onPress={isLast ? handleFinish : nextExercise}
          className="h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: '#1A1008' }}>
          <SkipForward size={22} color="#fff" fill="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Finish Session button ── */}
      <View className="mt-auto px-5 pb-10">
        <TouchableOpacity
          onPress={handleFinish}
          disabled={isSaving}
          activeOpacity={0.88}
          className="h-16 items-center justify-center rounded-[18px] bg-white">
          <Text className="text-[16px] font-black text-gray-900">
            {isSaving ? 'Saving...' : 'Finish Session'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
