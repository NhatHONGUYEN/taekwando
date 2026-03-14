import { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { useSessions } from '@/features/session/hooks/useSessions';
import type { SessionPopulated } from '@/features/session/types/session.types';

const BG = '#0D0905';
const SURFACE = '#1A1008';
const BORDER = '#2D2015';
const BRAND = '#E8622A';

const TABS = ['All', 'Sparring', 'Poomsae', 'Technique', 'Strength'] as const;
type Tab = (typeof TABS)[number];

function getDateGroup(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'TODAY';
  if (d.toDateString() === yesterday.toDateString()) return 'YESTERDAY';
  return d
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
}

function getSessionName(session: SessionPopulated): string {
  if (session.notes) return session.notes;
  const first = session.items[0]?.exerciseId;
  if (first && typeof first === 'object' && 'name' in first)
    return (first as { name: string }).name;
  return 'Training Session';
}

function getSessionImage(session: SessionPopulated): string | null {
  const first = session.items[0]?.exerciseId;
  if (first && typeof first === 'object' && 'image' in first) {
    const ex = first as { image?: { url?: string } };
    return ex.image?.url ?? null;
  }
  return null;
}

function getSessionCategory(session: SessionPopulated): string {
  const first = session.items[0]?.exerciseId;
  if (first && typeof first === 'object' && 'category' in first) {
    return (first as { category: string }).category;
  }
  return '';
}

function getScore(session: SessionPopulated): number | null {
  const rpes = session.items.map((i) => i.rpe).filter((r): r is number => r != null);
  if (!rpes.length) return null;
  return Math.round((rpes.reduce((a, b) => a + b, 0) / rpes.length) * 10);
}

export default function SessionsScreen() {
  const router = useRouter();
  const { data: sessions, isLoading } = useSessions();
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const filtered = useMemo(() => {
    if (!sessions) return [];
    if (activeTab === 'All') return sessions;
    return sessions.filter((s) => {
      const cat = getSessionCategory(s).toLowerCase();
      return cat === activeTab.toLowerCase();
    });
  }, [sessions, activeTab]);

  // Group by date label
  const groups = useMemo(() => {
    const map = new Map<string, SessionPopulated[]>();
    for (const s of filtered) {
      const label = getDateGroup(s.performedAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(s);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* ── Header ── */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            color: '#fff',
            fontWeight: '800',
            fontSize: 20,
            flex: 1,
            textAlign: 'center',
            marginRight: 38,
          }}>
          Training History
        </Text>
      </View>

      {/* ── Tab filters ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 24, paddingBottom: 4 }}
        style={{ flexGrow: 0, marginBottom: 8 }}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{ paddingBottom: 10 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: activeTab === tab ? '700' : '500',
                color: activeTab === tab ? BRAND : '#6B7280',
              }}>
              {tab}
            </Text>
            {activeTab === tab && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: BRAND,
                  borderRadius: 1,
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Divider ── */}
      <View
        style={{ height: 1, backgroundColor: BORDER, marginHorizontal: 20, marginBottom: 20 }}
      />

      {/* ── Content ── */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#6B7280' }}>Loading sessions...</Text>
        </View>
      ) : groups.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 8 }}>
            No sessions yet
          </Text>
          <Text
            style={{
              color: '#6B7280',
              fontSize: 13,
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 20,
            }}>
            Open a playlist and start a session to see your training history.
          </Text>
          <TouchableOpacity
            onPress={() => router.navigate('/(protected)/(tabs)/playlists')}
            activeOpacity={0.85}
            style={{
              backgroundColor: BRAND,
              borderRadius: 14,
              paddingHorizontal: 24,
              paddingVertical: 12,
            }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Go to playlists</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={([label]) => label}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: [label, items] }) => (
            <View style={{ marginBottom: 24 }}>
              {/* Date group label */}
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 1.2,
                  marginBottom: 12,
                }}>
                {label}
              </Text>

              {items.map((session) => {
                const mins = Math.max(1, Math.round(session.durationSec / 60));
                const score = getScore(session);
                const name = getSessionName(session);
                const thumb = getSessionImage(session);
                const isToday = label === 'TODAY';

                return (
                  <TouchableOpacity
                    key={session._id}
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: '/(protected)/session/[id]',
                        params: { id: session._id },
                      })
                    }
                    style={{
                      backgroundColor: SURFACE,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: BORDER,
                      marginBottom: 12,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: 12,
                    }}>
                    {/* Left content */}
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 4,
                        }}>
                        {/* Status dot */}
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: isToday ? BRAND : '#4B5563',
                          }}
                        />
                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16, flex: 1 }}>
                          {name}
                        </Text>
                      </View>

                      <Text style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 12 }}>
                        {mins} mins
                        {score != null ? (
                          <>
                            {' • Score: '}
                            <Text style={{ color: BRAND, fontWeight: '700' }}>{score}</Text>
                          </>
                        ) : (
                          ` • ${session.items.length} exercise${session.items.length !== 1 ? 's' : ''}`
                        )}
                      </Text>

                      {/* View Analysis button */}
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: '/(protected)/session/[id]',
                            params: { id: session._id },
                          })
                        }
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          alignSelf: 'flex-start',
                          backgroundColor: '#2D2015',
                          borderRadius: 10,
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          gap: 4,
                        }}>
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>
                          View Analysis
                        </Text>
                        <ChevronRight size={13} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>

                    {/* Thumbnail */}
                    {thumb && (
                      <Image
                        source={{ uri: thumb }}
                        style={{ width: 110, height: 110, borderRadius: 14 }}
                        resizeMode="cover"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
      )}
    </View>
  );
}
