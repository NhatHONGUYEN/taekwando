import { ScrollView, View, Text, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useUser } from '@/features/user/hooks/useUser';
import { useSessions } from '@/features/session/hooks/useSessions';
import { usePlaylists } from '@/features/playlists/hooks/usePlaylists';
import {
  Bell,
  Zap,
  Target,
  ListMusic,
  Dumbbell,
  Timer,
  RotateCcw,
  Play,
} from 'lucide-react-native';

const BRAND = '#E8622A';
const SURFACE = '#1A1008';
const BORDER = '#2D2015';

const QUICK_ACTIONS = [
  { label: 'Playlists', Icon: ListMusic, href: '/(protected)/(tabs)/playlists' as Href },
  { label: 'Exercises', Icon: Dumbbell, href: '/(protected)/(tabs)/exercises' as Href },
  { label: 'HIIT Timer', Icon: Timer, href: '/(protected)/(tabs)/sessions' as Href },
  { label: 'Re-play', Icon: RotateCcw, href: '/(protected)/(tabs)/sessions' as Href },
];

const QUOTES = [
  '"The target is not the opponent, but the version of yourself from yesterday. Strike true."',
  '"A black belt is a white belt who never quit."',
  '"Train your mind as hard as you train your body."',
  '"Every kick is a conversation with your limits."',
];

export default function HomeScreen() {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: sessions } = useSessions();
  const { data: playlists } = usePlaylists();

  const lastSession = sessions?.[0];
  const quote = QUOTES[new Date().getDay() % QUOTES.length];
  const focusGoals = user?.goals?.length
    ? user.goals.slice(0, 2)
    : ['Power Kicks', 'Core Stability'];

  return (
    <View className="bg-tkd-bg flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#0D0905" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ── Header ── */}
        <View className="flex-row items-center justify-between px-5 pb-4 pt-14">
          <TouchableOpacity
            onPress={() => router.push('/(protected)/(tabs)/profile' as Href)}
            className="bg-tkd-surface h-10 w-10 items-center justify-center rounded-full">
            <Text className="text-base font-bold text-white">
              {(user?.displayName?.[0] ?? 'U').toUpperCase()}
            </Text>
          </TouchableOpacity>

          <Text style={{ color: BRAND, fontWeight: '800', fontSize: 20, letterSpacing: 2 }}>
            TKD STRIKE
          </Text>

          <TouchableOpacity className="bg-tkd-surface h-10 w-10 items-center justify-center rounded-full">
            <Bell size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="px-5">
          {/* ── Greeting ── */}
          <Text className="text-3xl font-black text-white">
            Hello, {user?.displayName || 'Fighter'}
          </Text>
          <Text className="mb-5 mt-1 text-sm text-gray-500">Ready to push your limits today?</Text>

          {/* ── Hero Banner ── */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.navigate('/(protected)/(tabs)/playlists' as Href)}
            className="mb-6 overflow-hidden rounded-2xl"
            style={{ height: 184 }}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800' }}
              className="flex-1"
              imageStyle={{ opacity: 0.45 }}>
              <View
                className="flex-1 flex-row items-end justify-between p-4"
                style={{ backgroundColor: 'rgba(26,16,8,0.55)' }}>
                <View>
                  <Text
                    style={{
                      color: BRAND,
                      fontSize: 11,
                      fontWeight: '700',
                      letterSpacing: 1.5,
                      marginBottom: 4,
                    }}>
                    PREMIUM TRAINING
                  </Text>
                  <Text className="mb-1 text-2xl font-black italic text-white">START TRAINING</Text>
                  <Text className="text-sm text-gray-300">High-intensity session</Text>
                  <Text style={{ color: BRAND, fontSize: 13, fontWeight: '600' }}>
                    Orange Strike Edition
                  </Text>
                </View>
                <View
                  className="items-center justify-center rounded-xl"
                  style={{ width: 52, height: 52, backgroundColor: BRAND }}>
                  <Play size={22} color="white" fill="white" />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* ── Today's Focus ── */}
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">Today's Focus</Text>
            <TouchableOpacity>
              <Text style={{ color: BRAND, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                EDIT GOALS
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-6 flex-row gap-3">
            {focusGoals.map((goal, index) => (
              <View
                key={goal}
                className="flex-1 rounded-2xl p-4"
                style={{
                  backgroundColor: index === 0 ? '#1f0e02' : SURFACE,
                  borderWidth: 1.5,
                  borderColor: index === 0 ? BRAND : BORDER,
                }}>
                {index === 0 ? (
                  <Zap size={18} color={BRAND} style={{ marginBottom: 8 }} />
                ) : (
                  <Target size={18} color="#6B7280" style={{ marginBottom: 8 }} />
                )}
                <Text className="mb-1 text-xs text-gray-500">{goal}</Text>
                <Text className="text-xl font-black text-white">45 min</Text>
              </View>
            ))}
          </View>

          {/* ── Quick Actions ── */}
          <Text className="mb-4 text-lg font-bold text-white">Quick Actions</Text>
          <View className="mb-6 flex-row justify-between">
            {QUICK_ACTIONS.map(({ label, Icon, href }) => (
              <TouchableOpacity
                key={label}
                onPress={() => router.navigate(href)}
                className="items-center gap-2">
                <View
                  className="items-center justify-center rounded-full"
                  style={{ width: 60, height: 60, backgroundColor: SURFACE }}>
                  <Icon size={24} color="white" />
                </View>
                <Text className="text-xs font-medium text-gray-400">{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Last Training Summary ── */}
          {lastSession ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/(protected)/session/[id]',
                  params: { id: lastSession._id },
                } as Href)
              }
              className="mb-4 rounded-2xl p-5"
              style={{ backgroundColor: SURFACE }}>
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 1.5,
                  marginBottom: 16,
                }}>
                LAST TRAINING SUMMARY
              </Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-3xl font-black text-white">
                    {lastSession.items.length * 50}
                  </Text>
                  <Text style={{ color: '#6B7280', fontSize: 11, letterSpacing: 1, marginTop: 2 }}>
                    CALORIES
                  </Text>
                </View>
                <View style={{ width: 1, backgroundColor: BORDER }} />
                <View className="items-center">
                  <Text className="text-3xl font-black text-white">
                    {Math.floor(lastSession.durationSec / 60)}
                  </Text>
                  <Text style={{ color: '#6B7280', fontSize: 11, letterSpacing: 1, marginTop: 2 }}>
                    MINUTES
                  </Text>
                </View>
                <View style={{ width: 1, backgroundColor: BORDER }} />
                <View className="items-center">
                  <Text style={{ color: BRAND, fontSize: 28, fontWeight: '800' }}>A+</Text>
                  <Text style={{ color: '#6B7280', fontSize: 11, letterSpacing: 1, marginTop: 2 }}>
                    FORM SCORE
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View
              className="mb-4 items-center rounded-2xl p-5"
              style={{ backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER }}>
              <Text className="text-sm text-gray-500">No sessions yet.</Text>
              <Text className="mt-1 text-xs text-gray-600">
                Start your first session from a playlist.
              </Text>
            </View>
          )}

          {/* ── Motivational Quote ── */}
          <View
            className="items-center rounded-2xl p-5"
            style={{ borderWidth: 1.5, borderColor: `${BRAND}55`, borderStyle: 'dashed' }}>
            <Text
              style={{
                color: BRAND,
                fontSize: 28,
                fontWeight: '800',
                marginBottom: 6,
                lineHeight: 30,
              }}>
              ❝❝
            </Text>
            <Text className="text-center text-sm italic leading-6 text-gray-400">{quote}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
