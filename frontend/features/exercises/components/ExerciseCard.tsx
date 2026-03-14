import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Clock, Dumbbell } from 'lucide-react-native';
import { AddToPlaylistModal } from './AddToPlaylistModal';
import type { Exercise } from '../types';

const BRAND = '#E8622A';
const SURFACE = '#1A1008';

function levelBadge(level: number): { label: string; bg: string } {
  if (level <= 2) return { label: 'BEGINNER', bg: '#16A34A' };
  if (level === 3) return { label: 'INTERMEDIATE', bg: BRAND };
  return { label: 'ADVANCED', bg: '#EF4444' };
}

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
  const [modal, setModal] = useState(false);
  const badge = levelBadge(exercise.level);
  const mins = Math.max(1, Math.round(exercise.durationSecDefault / 60));
  const focus = exercise.focus[0]
    ? exercise.focus[0].charAt(0).toUpperCase() + exercise.focus[0].slice(1)
    : 'Focus';
  const equip =
    !exercise.equipment[0] || exercise.equipment[0] === 'none'
      ? 'No Equipment'
      : exercise.equipment[0].charAt(0).toUpperCase() + exercise.equipment[0].slice(1) + ' Req.';

  return (
    <>
      <AddToPlaylistModal exercise={modal ? exercise : null} onClose={() => setModal(false)} />
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: '/(protected)/exercise/[slug]',
            params: { slug: exercise.slug },
          } as Href)
        }
        style={{
          backgroundColor: SURFACE,
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
        {/* ── Image ───────────────────────────────────── */}
        <View style={{ height: 164 }}>
          <Image
            source={{ uri: exercise.image?.url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {/* Bottom overlay */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 56,
              backgroundColor: 'rgba(0,0,0,0.35)',
            }}
          />
          {/* Level badge */}
          <View
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: badge.bg,
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}>
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>
              {badge.label}
            </Text>
          </View>
          {/* Add to playlist */}
          <TouchableOpacity
            onPress={() => setModal(true)}
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: BRAND,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ color: '#fff', fontSize: 22, lineHeight: 24, marginTop: -1 }}>+</Text>
          </TouchableOpacity>
        </View>
        {/* ── Info ────────────────────────────────────── */}
        <View style={{ padding: 14 }}>
          <Text
            style={{ color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 8 }}
            numberOfLines={1}>
            {exercise.name}
          </Text>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Clock size={12} color="#6B7280" />
              <Text style={{ color: '#6B7280', fontSize: 12 }}>{mins} min</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Dumbbell size={12} color="#6B7280" />
              <Text style={{ color: '#6B7280', fontSize: 12 }}>{focus}</Text>
            </View>
            <Text style={{ color: '#6B7280', fontSize: 12 }}>{equip}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
