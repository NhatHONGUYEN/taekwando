import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Search, User, Dumbbell, Leaf, Activity } from 'lucide-react-native';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import { ExerciseCard } from '@/features/exercises/components/ExerciseCard';
import type { ExerciseCategory } from '@/features/exercises/types';

const BRAND = '#E8622A';
const SURFACE = '#1A1008';
const BG = '#0D0905';

type Chip = { label: string; category?: ExerciseCategory };

const CHIPS: Chip[] = [
  { label: 'ALL' },
  { label: 'DRILLS', category: 'technique' },
  { label: 'KICKS', category: 'technique' },
  { label: 'POOMSAE', category: 'poomsae' },
  { label: 'SPARRING', category: 'sparring' },
  { label: 'MOBILITY', category: 'mobility' },
  { label: 'STRENGTH', category: 'strength' },
  { label: 'FLEXIBILITY', category: 'flexibility' },
];

const TOP_CATS = [
  { label: 'STRENGTH', cat: 'strength' as ExerciseCategory, Icon: Dumbbell, color: BRAND },
  { label: 'FLEXIBILITY', cat: 'flexibility' as ExerciseCategory, Icon: Leaf, color: '#22C55E' },
  { label: 'BALANCE', cat: 'mobility' as ExerciseCategory, Icon: Activity, color: '#3B82F6' },
];

export default function ExercisesScreen() {
  const router = useRouter();
  const [active, setActive] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const selectedCat = CHIPS.find((c) => c.label === active)?.category;

  const { data, isLoading } = useExercises({ category: selectedCat, page, limit: 20 });

  const items = useMemo(() => {
    const list = data?.items ?? [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (e) => e.name.toLowerCase().includes(q) || e.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [data?.items, search]);

  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ExerciseCard exercise={item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* ── Nav ─────────────────────────────── */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 56,
                paddingBottom: 20,
              }}>
              <View style={{ gap: 5 }}>
                <View style={{ width: 22, height: 2, backgroundColor: BRAND, borderRadius: 1 }} />
                <View style={{ width: 16, height: 2, backgroundColor: BRAND, borderRadius: 1 }} />
                <View style={{ width: 22, height: 2, backgroundColor: BRAND, borderRadius: 1 }} />
              </View>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18, letterSpacing: 2 }}>
                LIBRARY
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(protected)/(tabs)/profile' as Href)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: SURFACE,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <User size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* ── Search ──────────────────────────── */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: SURFACE,
                borderRadius: 14,
                paddingHorizontal: 14,
                height: 46,
                marginBottom: 16,
              }}>
              <Search size={16} color="#6B7280" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search drills, kicks, poomsae..."
                placeholderTextColor="#4B5563"
                style={{ flex: 1, marginLeft: 10, fontSize: 14, color: '#fff' }}
              />
            </View>

            {/* ── Category chips ───────────────────── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 24 }}
              contentContainerStyle={{ gap: 8 }}>
              {CHIPS.map((chip) => (
                <TouchableOpacity
                  key={chip.label}
                  onPress={() => {
                    setActive(chip.label);
                    setPage(1);
                  }}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: active === chip.label ? BRAND : SURFACE,
                  }}>
                  <Text
                    style={{ color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ── Section heading ──────────────────── */}
            {isLoading ? (
              <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 16 }}>
                Loading exercises...
              </Text>
            ) : (
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '900',
                  fontSize: 20,
                  fontStyle: 'italic',
                  marginBottom: 16,
                }}>
                RECOMMENDED FOR YOU
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ marginTop: 32, alignItems: 'center' }}>
              <Text style={{ color: '#6B7280' }}>No exercises found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <>
            {page < totalPages && (
              <TouchableOpacity
                onPress={() => setPage((p) => p + 1)}
                style={{
                  backgroundColor: SURFACE,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                  marginBottom: 24,
                }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Load more</Text>
              </TouchableOpacity>
            )}

            {/* ── Top Techniques ───────────────────── */}
            <View style={{ marginTop: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '900',
                    fontSize: 20,
                    fontStyle: 'italic',
                  }}>
                  TOP TECHNIQUES
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setActive('ALL');
                    setPage(1);
                  }}>
                  <Text style={{ color: BRAND, fontSize: 13, fontWeight: '700' }}>SEE ALL</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {TOP_CATS.map(({ label, cat, Icon, color }) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() => {
                      const chip = CHIPS.find((c) => c.category === cat);
                      if (chip) {
                        setActive(chip.label);
                        setPage(1);
                      }
                    }}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      backgroundColor: SURFACE,
                      borderRadius: 16,
                      paddingVertical: 20,
                    }}>
                    <Icon size={28} color={color} />
                    <Text
                      style={{
                        color: '#9CA3AF',
                        fontSize: 10,
                        fontWeight: '700',
                        letterSpacing: 1,
                        marginTop: 10,
                      }}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        }
      />
    </View>
  );
}
