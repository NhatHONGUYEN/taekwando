import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSessionStore } from '@/features/session/store/useSessionStore';
import { useCreateSession } from '@/features/session/hooks/useCreateSession';
import { mapRuntimeToPayload } from '@/features/session/utils/session.mapper';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const SESSIONS_HREF = '/(protected)/(tabs)/sessions' as Href;

export default function RunSessionScreen() {
  const router = useRouter();
  const { mutate: saveSession, isPending: isSaving } = useCreateSession();

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
    updateCurrentExercise,
    finishSession,
    resetSession,
  } = useSessionStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second when running
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

  // No session loaded
  if (status === 'idle' || items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-6 text-center text-gray-500">No session started.</Text>
        <TouchableOpacity
          onPress={() => router.replace(SESSIONS_HREF)}
          className="rounded-lg bg-gray-900 px-6 py-3">
          <Text className="font-semibold text-white">Go to history</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentItem = items[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === items.length - 1;

  const handleFinish = () => {
    Alert.alert('Finish session?', 'Save and close this session.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Finish',
        onPress: () => {
          finishSession();
          const payload = mapRuntimeToPayload(items, startedAt!, new Date());
          saveSession(payload, {
            onSuccess: () => {
              resetSession();
              router.replace(SESSIONS_HREF);
            },
            onError: () => {
              Alert.alert('Error', 'Could not save session. Please try again.');
            },
          });
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-gray-900 px-4 pb-4 pt-12">
        <Text className="text-sm text-gray-400">
          {currentIndex + 1} / {items.length}
        </Text>
        <Text className="font-semibold text-white">Session</Text>
        <TouchableOpacity onPress={handleFinish} disabled={isSaving}>
          <Text className="text-sm font-medium text-red-400">
            {isSaving ? 'Saving...' : 'Finish'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Exercise name */}
        <Text className="mb-1 text-center text-2xl font-bold text-gray-900">
          {currentItem.exerciseName}
        </Text>
        <Text className="mb-6 text-center text-sm capitalize text-gray-400">
          {currentItem.exerciseSlug}
        </Text>

        {/* Timer */}
        <View className="mb-6 items-center">
          <Text className="text-6xl font-bold tabular-nums text-gray-900">
            {formatTime(secondsLeft)}
          </Text>
          <Text className="mt-1 text-xs text-gray-400">
            target: {formatTime(currentItem.targetDurationSec)}
          </Text>
        </View>

        {/* Play / Pause */}
        <TouchableOpacity
          onPress={status === 'running' ? pauseSession : resumeSession}
          className="mb-6 items-center rounded-xl bg-gray-900 py-4">
          <Text className="text-base font-semibold text-white">
            {status === 'running' ? 'Pause' : 'Resume'}
          </Text>
        </TouchableOpacity>

        {/* RPE */}
        <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-3 font-semibold text-gray-700">RPE (1–10)</Text>
          <View className="flex-row gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
              <TouchableOpacity
                key={v}
                onPress={() => updateCurrentExercise({ rpe: v })}
                className={`h-8 w-8 items-center justify-center rounded-full ${
                  currentItem.rpe === v ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                <Text
                  className={`text-xs font-medium ${
                    currentItem.rpe === v ? 'text-white' : 'text-gray-700'
                  }`}>
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pain */}
        <View className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-3 font-semibold text-gray-700">Pain</Text>
          {(['hip', 'knee', 'lowerBack'] as const).map((zone) => (
            <View key={zone} className="mb-3">
              <Text className="mb-1 text-xs capitalize text-gray-500">
                {zone === 'lowerBack' ? 'Lower back' : zone}
              </Text>
              <View className="flex-row gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                  <TouchableOpacity
                    key={v}
                    onPress={() =>
                      updateCurrentExercise({ pain: { ...currentItem.pain, [zone]: v } })
                    }
                    className={`h-7 w-7 items-center justify-center rounded-md ${
                      currentItem.pain?.[zone] === v ? 'bg-red-500' : 'bg-gray-100'
                    }`}>
                    <Text
                      className={`text-xs ${
                        currentItem.pain?.[zone] === v ? 'text-white' : 'text-gray-600'
                      }`}>
                      {v}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Progress bar */}
        <View className="mb-6 flex-row gap-1">
          {items.map((_, i) => (
            <View
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < currentIndex
                  ? 'bg-green-500'
                  : i === currentIndex
                    ? 'bg-gray-900'
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </View>

        {/* Prev / Next */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={previousExercise}
            disabled={isFirst}
            className={`flex-1 items-center rounded-xl py-3 ${
              isFirst ? 'bg-gray-100' : 'bg-gray-200'
            }`}>
            <Text className={`font-medium ${isFirst ? 'text-gray-300' : 'text-gray-700'}`}>
              ← Prev
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isLast ? handleFinish : nextExercise}
            className="flex-1 items-center rounded-xl bg-gray-900 py-3">
            <Text className="font-medium text-white">{isLast ? 'Finish →' : 'Next →'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
