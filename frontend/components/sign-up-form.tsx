import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { Dumbbell, Shield, Trophy, UserCircle2, Zap } from 'lucide-react-native';
import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const BELT_LEVELS = [
  { key: 'white', label: 'WHITE', color: '#FFFFFF' },
  { key: 'yellow', label: 'YELLOW', color: '#FACC15' },
  { key: 'green', label: 'GREEN', color: '#22C55E' },
  { key: 'blue', label: 'BLUE', color: '#3B82F6' },
  { key: 'red', label: 'RED', color: '#EF4444' },
  { key: 'black', label: 'BLACK', color: '#374151' },
] as const;

type BeltKey = (typeof BELT_LEVELS)[number]['key'];

const PRIMARY_GOALS = [
  { key: 'self_defense', label: 'SELF DEFENSE', Icon: Shield },
  { key: 'competition', label: 'COMPETITION', Icon: Trophy },
  { key: 'fitness', label: 'FITNESS', Icon: Dumbbell },
  { key: 'flexibility', label: 'FLEXIBILITY', Icon: UserCircle2 },
] as const;

type GoalKey = (typeof PRIMARY_GOALS)[number]['key'];

const SECTION_STYLE = {
  backgroundColor: '#0F0905',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#2D2015',
  padding: 20,
  marginBottom: 16,
} as const;

const INPUT_STYLE = {
  backgroundColor: '#fff',
  borderRadius: 12,
  height: 52,
  paddingHorizontal: 16,
  fontSize: 15,
  color: '#111',
  marginBottom: 12,
} as const;

const LABEL_STYLE = {
  color: '#C0C8D4',
  fontSize: 11,
  fontWeight: '700' as const,
  letterSpacing: 2,
  marginBottom: 6,
};

export function SignUpForm() {
  const { signUp, isLoaded } = useSignUp();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [beltLevel, setBeltLevel] = React.useState<BeltKey>('white');
  const [primaryGoal, setPrimaryGoal] = React.useState<GoalKey>('self_defense');
  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<{ email?: string; password?: string }>({});

  async function onSubmit() {
    if (!isLoaded) return;
    try {
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.slice(1).join(' ') || undefined;
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        unsafeMetadata: { beltLevel, primaryGoal },
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      router.push(`/(auth)/sign-up/verify-email?email=${email}`);
    } catch (err) {
      if (err instanceof Error) {
        const isEmailMessage =
          err.message.toLowerCase().includes('identifier') ||
          err.message.toLowerCase().includes('email');
        setError(isEmailMessage ? { email: err.message } : { password: err.message });
        return;
      }
      console.error(JSON.stringify(err, null, 2));
    }
  }

  return (
    <View>
      {/* ── Hero ── */}
      <View className="mb-7 items-center">
        <View
          className="mb-4 items-center justify-center rounded-full"
          style={{ width: 64, height: 64, backgroundColor: '#1A0E05' }}>
          <Zap size={28} color="#E8622A" fill="#E8622A" />
        </View>
        <Text style={{ fontSize: 30, fontWeight: '900', color: '#fff' }}>
          JOIN <Text style={{ color: '#E8622A' }}>TKD STRIKE</Text>
        </Text>
        <Text
          className="mt-2 text-center"
          style={{ color: '#8A9BB0', fontSize: 13, lineHeight: 20 }}>
          {'Elevate your martial arts journey.\nProfessional training at your fingertips.'}
        </Text>
      </View>

      {/* ── ACCOUNT section ── */}
      <View style={SECTION_STYLE}>
        <View className="mb-4 flex-row items-center gap-2">
          <UserCircle2 size={16} color="#E8622A" />
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 2 }}>
            ACCOUNT
          </Text>
        </View>
        <View style={{ height: 1, backgroundColor: '#2D2015', marginBottom: 16 }} />

        <Text style={LABEL_STYLE}>FULL NAME</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Lee Chang-ho"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          style={INPUT_STYLE}
        />

        <Text style={LABEL_STYLE}>EMAIL ADDRESS</Text>
        <TextInput
          ref={emailRef}
          value={email}
          onChangeText={setEmail}
          placeholder="lee@strike.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          style={INPUT_STYLE}
        />
        {!!error.email && (
          <Text style={{ color: '#F87171', fontSize: 12, marginTop: -8, marginBottom: 10 }}>
            {error.email}
          </Text>
        )}

        <Text style={LABEL_STYLE}>PASSWORD</Text>
        <TextInput
          ref={passwordRef}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          returnKeyType="send"
          onSubmitEditing={onSubmit}
          style={{ ...INPUT_STYLE, marginBottom: 0 }}
        />
        {!!error.password && (
          <Text style={{ color: '#F87171', fontSize: 12, marginTop: 6 }}>{error.password}</Text>
        )}
      </View>

      {/* ── TRAINING section ── */}
      <View style={SECTION_STYLE}>
        <View className="mb-4 flex-row items-center gap-2">
          <Zap size={16} color="#E8622A" />
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 2 }}>
            TRAINING
          </Text>
        </View>
        <View style={{ height: 1, backgroundColor: '#2D2015', marginBottom: 16 }} />

        {/* Belt level */}
        <Text style={{ ...LABEL_STYLE, marginBottom: 10 }}>CURRENT BELT LEVEL</Text>
        <View className="mb-5 flex-row flex-wrap gap-2">
          {BELT_LEVELS.map(({ key, label, color }) => (
            <TouchableOpacity
              key={key}
              onPress={() => setBeltLevel(key)}
              activeOpacity={0.75}
              style={{
                flex: 1,
                minWidth: 48,
                alignItems: 'center',
                gap: 4,
              }}>
              <View
                style={{
                  height: 10,
                  borderRadius: 5,
                  width: '100%',
                  backgroundColor: color,
                  borderWidth: beltLevel === key ? 2 : 0,
                  borderColor: '#E8622A',
                  opacity: beltLevel === key ? 1 : 0.5,
                }}
              />
              <Text
                style={{
                  color: beltLevel === key ? '#fff' : '#6B7280',
                  fontSize: 9,
                  fontWeight: '700',
                  letterSpacing: 1,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Primary goal */}
        <Text style={{ ...LABEL_STYLE, marginBottom: 10 }}>PRIMARY GOAL</Text>
        <View className="flex-row flex-wrap gap-2">
          {PRIMARY_GOALS.map(({ key, label, Icon }) => {
            const active = primaryGoal === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setPrimaryGoal(key)}
                activeOpacity={0.75}
                style={{
                  width: '47%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: active ? '#2D1005' : '#1A1008',
                  borderWidth: 1,
                  borderColor: active ? '#E8622A' : '#2D2015',
                  gap: 6,
                }}>
                <Icon size={20} color={active ? '#E8622A' : '#6B7280'} />
                <Text
                  style={{
                    color: active ? '#E8622A' : '#6B7280',
                    fontSize: 10,
                    fontWeight: '800',
                    letterSpacing: 1.5,
                  }}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── IGNITE button ── */}
      <TouchableOpacity
        onPress={onSubmit}
        activeOpacity={0.85}
        style={{
          backgroundColor: '#E8622A',
          height: 58,
          borderRadius: 30,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 16,
        }}>
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 3 }}>
          IGNITE JOURNEY
        </Text>
        <Zap size={16} color="#fff" fill="#fff" />
      </TouchableOpacity>

      {/* ── Login link ── */}
      <View className="mb-8 flex-row items-center justify-center gap-1">
        <Text style={{ color: '#9CA3AF', fontSize: 13 }}>Already a master?</Text>
        <Link href="/(auth)/sign-in" dismissTo asChild>
          <TouchableOpacity hitSlop={8}>
            <Text style={{ color: '#E8622A', fontSize: 13, fontWeight: '800' }}> Login here</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* ── Footer ── */}
      <Text className="text-center" style={{ color: '#3D3020', fontSize: 10, letterSpacing: 1.5 }}>
        © 2024 TKD STRIKE GLOBAL ACADEMY. ALL RIGHTS RESERVED.
      </Text>
    </View>
  );
}
