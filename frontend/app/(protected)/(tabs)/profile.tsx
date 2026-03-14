import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useAuth, useUser as useClerkUser } from '@clerk/clerk-expo';
import { useUser } from '@/features/user/hooks/useUser';
import { useUpdateUser } from '@/features/user/hooks/useUpdateUser';

const LEVEL_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Novice',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

const ALL_GOALS = ['flexibility', 'strength', 'endurance', 'speed', 'balance', 'weight loss'];

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user: clerkUser } = useClerkUser();
  const { data: appUser } = useUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [level, setLevel] = useState(1);
  const [goals, setGoals] = useState<string[]>([]);

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

  const initials = (appUser?.displayName ?? clerkUser?.fullName ?? '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="items-center bg-gray-900 px-4 pb-8 pt-14">
        <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-gray-700">
          <Text className="text-2xl font-bold text-white">{initials}</Text>
        </View>
        <Text className="text-xl font-bold text-white">
          {appUser?.displayName || clerkUser?.fullName || 'Fighter'}
        </Text>
        <Text className="mt-1 text-sm text-gray-400">
          {clerkUser?.emailAddresses[0]?.emailAddress}
        </Text>
      </View>

      <View className="px-4 pt-6">
        {editing ? (
          /* ── Edit form ── */
          <View className="mb-4 rounded-xl bg-white px-4 py-4 shadow-sm">
            <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Edit profile
            </Text>

            {/* Display name */}
            <Text className="mb-1 text-sm text-gray-500">Display name</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              className="mb-4 rounded-lg border border-gray-200 px-3 py-2 text-gray-900"
            />

            {/* Level */}
            <Text className="mb-2 text-sm text-gray-500">Level</Text>
            <View className="mb-4 flex-row gap-2">
              {([1, 2, 3, 4, 5] as const).map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  onPress={() => setLevel(lvl)}
                  className={`flex-1 items-center rounded-lg py-2 ${
                    level === lvl ? 'bg-gray-900' : 'bg-gray-100'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${
                      level === lvl ? 'text-white' : 'text-gray-600'
                    }`}>
                    {lvl}
                  </Text>
                  <Text
                    className={`text-[10px] ${level === lvl ? 'text-gray-300' : 'text-gray-400'}`}>
                    {LEVEL_LABELS[lvl]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Goals */}
            <Text className="mb-2 text-sm text-gray-500">Goals</Text>
            <View className="mb-6 flex-row flex-wrap gap-2">
              {ALL_GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  onPress={() => toggleGoal(goal)}
                  className={`rounded-full px-3 py-1.5 ${
                    goals.includes(goal) ? 'bg-gray-900' : 'bg-gray-100'
                  }`}>
                  <Text
                    className={`text-sm capitalize ${
                      goals.includes(goal) ? 'text-white' : 'text-gray-600'
                    }`}>
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setEditing(false)}
                className="flex-1 items-center rounded-xl border border-gray-200 py-3">
                <Text className="font-semibold text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 items-center rounded-xl bg-gray-900 py-3">
                <Text className="font-semibold text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* ── Read-only view ── */}

            {/* Edit button */}
            <TouchableOpacity
              onPress={openEdit}
              className="mb-4 items-center rounded-xl border border-gray-200 bg-white py-3">
              <Text className="font-semibold text-gray-700">Edit profile</Text>
            </TouchableOpacity>

            {/* Level */}
            {appUser && (
              <View className="mb-4 rounded-xl bg-white px-4 py-4 shadow-sm">
                <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Level
                </Text>
                <View className="flex-row items-center gap-3">
                  <Text className="text-3xl font-bold text-gray-900">{appUser.level}</Text>
                  <Text className="text-base text-gray-500">
                    {LEVEL_LABELS[appUser.level] ?? 'Fighter'}
                  </Text>
                </View>
                <View className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <View
                    className="h-2 rounded-full bg-gray-900"
                    style={{ width: `${(appUser.level / 5) * 100}%` }}
                  />
                </View>
              </View>
            )}

            {/* Goals */}
            {appUser && appUser.goals.length > 0 && (
              <View className="mb-4 rounded-xl bg-white px-4 py-4 shadow-sm">
                <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Goals
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {appUser.goals.map((goal) => (
                    <View key={goal} className="rounded-full bg-gray-100 px-3 py-1.5">
                      <Text className="text-sm capitalize text-gray-700">{goal}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Account info */}
            <View className="mb-4 rounded-xl bg-white px-4 py-4 shadow-sm">
              <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Account
              </Text>
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-500">Email</Text>
                  <Text className="text-sm font-medium text-gray-900">
                    {clerkUser?.emailAddresses[0]?.emailAddress}
                  </Text>
                </View>
                <View className="h-px bg-gray-100" />
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-500">Member since</Text>
                  <Text className="text-sm font-medium text-gray-900">
                    {appUser
                      ? new Date(appUser.createdAt).toLocaleDateString('en-GB', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Sign out */}
            <TouchableOpacity
              onPress={handleSignOut}
              className="items-center rounded-xl border border-red-200 bg-red-50 py-4">
              <Text className="font-semibold text-red-600">Sign out</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}
