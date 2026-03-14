import { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  StatusBar,
  Share,
} from 'react-native';
import { useAuth, useUser as useClerkUser } from '@clerk/clerk-expo';
import {
  ArrowLeft,
  Share2,
  UserPen,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  BadgeCheck,
  TrendingUp,
} from 'lucide-react-native';
import { useUser } from '@/features/user/hooks/useUser';
import { useUpdateUser } from '@/features/user/hooks/useUpdateUser';
import { useSessions } from '@/features/session/hooks/useSessions';

const BG = '#0D0905';
const SURFACE = '#1A1008';
const BORDER = '#2D2015';
const BRAND = '#E8622A';

const LEVEL_LABELS: Record<number, string> = {
  1: 'White Belt',
  2: 'Yellow Belt',
  3: 'Green Belt',
  4: 'Blue Belt',
  5: 'Black Belt',
};

const ALL_GOALS = ['flexibility', 'strength', 'endurance', 'speed', 'balance', 'sparring'];

const GOALS_PROGRESS: Record<string, number> = {
  flexibility: 85,
  strength: 70,
  endurance: 62,
  speed: 78,
  balance: 55,
  sparring: 90,
};

function StatCard({ value, label, trend }: { value: string; label: string; trend: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: SURFACE,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: BORDER,
        padding: 14,
        alignItems: 'center',
      }}>
      <Text style={{ color: BRAND, fontWeight: '900', fontSize: 26, marginBottom: 2 }}>
        {value}
      </Text>
      <Text
        style={{
          color: '#6B7280',
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.8,
          marginBottom: 6,
        }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <TrendingUp size={11} color="#22C55E" />
        <Text style={{ color: '#22C55E', fontSize: 11, fontWeight: '600' }}>{trend}</Text>
      </View>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  sub,
  onPress,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: SURFACE,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: BORDER,
        marginBottom: 10,
      }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          backgroundColor: danger ? 'rgba(239,68,68,0.12)' : '#2D2015',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: danger ? '#EF4444' : '#fff', fontWeight: '700', fontSize: 15 }}>
          {label}
        </Text>
        {sub && <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 1 }}>{sub}</Text>}
      </View>
      <ChevronRight size={16} color={danger ? '#EF4444' : '#4B5563'} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user: clerkUser } = useClerkUser();
  const { data: appUser } = useUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { data: sessions } = useSessions();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [level, setLevel] = useState(1);
  const [goals, setGoals] = useState<string[]>([]);

  const totalSessions = sessions?.length ?? 0;
  const totalHours = useMemo(() => {
    if (!sessions) return 0;
    return Math.round(sessions.reduce((acc, s) => acc + s.durationSec, 0) / 3600);
  }, [sessions]);
  const totalKicks = useMemo(() => {
    if (!sessions) return 0;
    return sessions.reduce((acc, s) => acc + s.items.length * 12, 0);
  }, [sessions]);

  const memberYear = appUser ? new Date(appUser.createdAt).getFullYear() : new Date().getFullYear();

  const openEdit = () => {
    setDisplayName(appUser?.displayName ?? '');
    setLevel(appUser?.level ?? 1);
    setGoals(appUser?.goals ?? []);
    setEditing(true);
  };

  const toggleGoal = (goal: string) => {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  };

  const handleSave = async () => {
    try {
      await updateUser({ displayName: displayName.trim() || undefined, level, goals });
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Could not save profile changes.');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const name = appUser?.displayName || clerkUser?.fullName || 'Fighter';
  const initials = name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const levelLabel = LEVEL_LABELS[appUser?.level ?? 1] ?? 'Fighter';

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* ── Top nav ── */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>Profile</Text>
        <TouchableOpacity
          onPress={() => Share.share({ title: name, message: `${name} — TKD STRIKE` })}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: SURFACE,
            borderWidth: 1,
            borderColor: BORDER,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Share2 size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {editing ? (
          /* ── Edit form ── */
          <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
            <View
              style={{
                backgroundColor: SURFACE,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: BORDER,
                padding: 20,
                marginBottom: 16,
              }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18, marginBottom: 20 }}>
                Edit Profile
              </Text>

              <Text style={{ color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                DISPLAY NAME
              </Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                placeholderTextColor="#4B5563"
                autoFocus
                style={{
                  backgroundColor: '#231810',
                  borderWidth: 1,
                  borderColor: BORDER,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: '#fff',
                  marginBottom: 20,
                }}
              />

              <Text style={{ color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 10 }}>
                BELT LEVEL
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
                {([1, 2, 3, 4, 5] as const).map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => setLevel(lvl)}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      borderRadius: 10,
                      paddingVertical: 10,
                      backgroundColor: level === lvl ? BRAND : '#2D2015',
                      borderWidth: 1,
                      borderColor: level === lvl ? BRAND : BORDER,
                    }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{lvl}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 10 }}>
                GOALS
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {ALL_GOALS.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    onPress={() => toggleGoal(goal)}
                    style={{
                      borderRadius: 20,
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      backgroundColor: goals.includes(goal) ? BRAND : '#2D2015',
                      borderWidth: 1,
                      borderColor: goals.includes(goal) ? BRAND : BORDER,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}>
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setEditing(false)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: BORDER,
                    paddingVertical: 14,
                  }}>
                  <Text style={{ color: '#9CA3AF', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    borderRadius: 12,
                    paddingVertical: 14,
                    backgroundColor: BRAND,
                  }}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* ── Avatar + identity ── */}
            <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 28 }}>
              {/* Avatar ring */}
              <View
                style={{
                  width: 108,
                  height: 108,
                  borderRadius: 54,
                  borderWidth: 3,
                  borderColor: BRAND,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 6,
                }}>
                <View
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    backgroundColor: '#2D2015',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 32 }}>{initials}</Text>
                </View>
                {/* Badge icon */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: BRAND,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: BG,
                  }}>
                  <BadgeCheck size={14} color="#fff" fill="#fff" />
                </View>
              </View>

              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 24, marginTop: 10 }}>
                {name}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <View
                  style={{
                    borderRadius: 20,
                    borderWidth: 1.5,
                    borderColor: '#fff',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}>
                  <Text
                    style={{ color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.8 }}>
                    {levelLabel.toUpperCase()}
                  </Text>
                </View>
                {(appUser?.level ?? 0) >= 5 && (
                  <Text style={{ color: BRAND, fontWeight: '700', fontSize: 14 }}>2nd Dan</Text>
                )}
              </View>

              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 12,
                  fontWeight: '600',
                  letterSpacing: 1.2,
                  marginTop: 8,
                }}>
                MEMBER SINCE {memberYear}
              </Text>
            </View>

            {/* ── Stats ── */}
            <View
              style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 32 }}>
              <StatCard
                value={
                  totalSessions > 999
                    ? `${(totalSessions / 1000).toFixed(1)}k`
                    : String(totalSessions)
                }
                label="SESSIONS"
                trend="12%"
              />
              <StatCard value={String(totalHours)} label="HOURS" trend="5%" />
              <StatCard
                value={totalKicks > 999 ? `${(totalKicks / 1000).toFixed(1)}k` : String(totalKicks)}
                label="KICKS"
                trend="8%"
              />
            </View>

            {/* ── Training Goals ── */}
            {appUser && appUser.goals.length > 0 && (
              <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>
                    Training Goals
                  </Text>
                  <TouchableOpacity onPress={openEdit}>
                    <Text style={{ color: BRAND, fontWeight: '600', fontSize: 14 }}>View All</Text>
                  </TouchableOpacity>
                </View>
                {appUser.goals.slice(0, 2).map((goal) => {
                  const pct = GOALS_PROGRESS[goal] ?? 60;
                  return (
                    <View key={goal} style={{ marginBottom: 16 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 6,
                        }}>
                        <Text
                          style={{
                            color: '#D1D5DB',
                            fontSize: 14,
                            fontWeight: '500',
                            textTransform: 'capitalize',
                          }}>
                          {goal.charAt(0).toUpperCase() + goal.slice(1)}
                        </Text>
                        <Text style={{ color: '#D1D5DB', fontSize: 14, fontWeight: '700' }}>
                          {pct}%
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 8,
                          backgroundColor: BORDER,
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}>
                        <View
                          style={{
                            height: 8,
                            backgroundColor: BRAND,
                            borderRadius: 4,
                            width: `${pct}%`,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* ── Menu rows ── */}
            <View style={{ paddingHorizontal: 20 }}>
              <MenuRow
                icon={<UserPen size={20} color="#9CA3AF" />}
                label="Edit Profile"
                sub="Personal details and display name"
                onPress={openEdit}
              />
              <MenuRow
                icon={<Settings size={20} color="#9CA3AF" />}
                label="Settings"
                sub="App preferences and security"
                onPress={() => {}}
              />
              <MenuRow
                icon={<Bell size={20} color="#9CA3AF" />}
                label="Notifications"
                sub="Manage alerts and reminders"
                onPress={() => {}}
              />

              {/* Spacer */}
              <View style={{ height: 8 }} />

              <MenuRow
                icon={<LogOut size={20} color="#EF4444" />}
                label="Logout"
                onPress={handleSignOut}
                danger
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
