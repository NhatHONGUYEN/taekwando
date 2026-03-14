import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Share, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Share2,
  Zap,
  Dumbbell,
  FileText,
  CheckCircle2,
  Play,
  ListPlus,
} from 'lucide-react-native';
import { useExercise } from '@/features/exercises/hooks/useExercise';
import { AddToPlaylistModal } from '@/features/exercises/components/AddToPlaylistModal';

const BG = '#0D0905';
const SURFACE = '#1A1008';
const BORDER = '#2D2015';
const BRAND = '#E8622A';

const LEVEL_LABEL: Record<number, string> = { 1: 'BEGINNER', 2: 'INTERMEDIATE', 3: 'ADVANCED' };
const LEVEL_COLOR: Record<number, string> = { 1: '#22C55E', 2: '#F59E0B', 3: '#EF4444' };

const CATEGORY_TITLE: Record<string, string> = {
  technique: 'Technique & Discipline',
  poomsae: 'Poomsae & Form',
  sparring: 'Sparring & Combat',
  mobility: 'Mobility & Movement',
  flexibility: 'Flexibility & Stretch',
  strength: 'Strength & Power',
};

export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const router = useRouter();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const { data: exercise, isLoading, isError } = useExercise(slug);

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#6B7280' }}>Loading...</Text>
      </View>
    );
  }

  if (isError || !exercise) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BG,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}>
        <Text style={{ color: '#6B7280' }}>Exercise not found.</Text>
      </View>
    );
  }

  const mins = Math.max(1, Math.round(exercise.durationSecDefault / 60));
  const levelLabel = LEVEL_LABEL[exercise.level] ?? `LEVEL ${exercise.level}`;
  const levelColor = LEVEL_COLOR[exercise.level] ?? BRAND;
  const sectionTitle = CATEGORY_TITLE[exercise.category] ?? 'About this Exercise';
  const focusText = exercise.focus.join(' & ');
  const equipmentText = exercise.equipment.filter((e) => e !== 'none').join(', ') || 'None';

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <AddToPlaylistModal
        exercise={showPlaylistModal ? exercise : null}
        onClose={() => setShowPlaylistModal(false)}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}>
        {/* ── Hero image ── */}
        <View style={{ height: 320, backgroundColor: '#111' }}>
          {exercise.image?.url ? (
            <Image
              source={{ uri: exercise.image.url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : null}

          {/* Gradient overlay */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 160,
              justifyContent: 'flex-end',
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: 'rgba(13,9,5,0.72)',
            }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 32, lineHeight: 38 }}>
              {exercise.name}
            </Text>
          </View>

          {/* Nav bar */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              paddingTop: 52,
              paddingHorizontal: 20,
              paddingBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: 'rgba(0,0,0,0.45)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ArrowLeft size={18} color="#fff" />
            </TouchableOpacity>

            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Exercise Detail</Text>

            <TouchableOpacity
              onPress={() => Share.share({ title: exercise.name, message: exercise.name })}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: 'rgba(0,0,0,0.45)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Share2 size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Level + duration row ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 20,
          }}>
          <View
            style={{
              backgroundColor: levelColor,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 5,
            }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.8 }}>
              {levelLabel}
            </Text>
          </View>
          <Text style={{ color: '#D1D5DB', fontWeight: '700', fontSize: 14 }}>{mins} MIN</Text>
        </View>

        {/* ── Info tiles ── */}
        <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 28 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: SURFACE,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: BORDER,
              padding: 14,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <Zap size={13} color={BRAND} fill={BRAND} />
              <Text style={{ color: BRAND, fontWeight: '700', fontSize: 11, letterSpacing: 0.6 }}>
                FOCUS
              </Text>
            </View>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
              {focusText || '—'}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: SURFACE,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: BORDER,
              padding: 14,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <Dumbbell size={13} color={BRAND} />
              <Text style={{ color: BRAND, fontWeight: '700', fontSize: 11, letterSpacing: 0.6 }}>
                EQUIPMENT
              </Text>
            </View>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{equipmentText}</Text>
          </View>
        </View>

        {/* ── Description section ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <FileText size={20} color={BRAND} />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>{sectionTitle}</Text>
          </View>

          {!!exercise.shortDescription && (
            <Text style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 24, marginBottom: 12 }}>
              {exercise.shortDescription}
            </Text>
          )}
          {!!exercise.description && (
            <Text style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 24 }}>
              {exercise.description}
            </Text>
          )}
        </View>

        {/* ── Instructions as checkmarks ── */}
        {exercise.instructions.length > 0 && (
          <View style={{ paddingHorizontal: 20, gap: 10 }}>
            {exercise.instructions.map((step, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 12,
                  backgroundColor: SURFACE,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: BORDER,
                  padding: 14,
                }}>
                <CheckCircle2 size={20} color={BRAND} fill={BRAND} style={{ marginTop: 1 }} />
                <Text style={{ flex: 1, color: '#D1D5DB', fontSize: 14, lineHeight: 21 }}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── Sticky bottom CTAs ── */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: BG,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 32,
          gap: 10,
          borderTopWidth: 1,
          borderTopColor: BORDER,
        }}>
        <TouchableOpacity
          onPress={() => setShowPlaylistModal(true)}
          activeOpacity={0.85}
          style={{
            backgroundColor: 'transparent',
            borderRadius: 16,
            height: 52,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            borderWidth: 1.5,
            borderColor: BRAND,
          }}>
          <ListPlus size={18} color={BRAND} />
          <Text style={{ color: BRAND, fontWeight: '700', fontSize: 15 }}>Add to Playlist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
