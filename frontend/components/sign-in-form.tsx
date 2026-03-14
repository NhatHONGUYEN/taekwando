import { useSignIn } from '@clerk/clerk-expo';
import { useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Eye, EyeOff, Zap } from 'lucide-react-native';
import * as React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const passwordInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<{ email?: string; password?: string }>({});

  async function onSubmit() {
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({ identifier: email, password });
      if (signInAttempt.status === 'complete') {
        setError({ email: '', password: '' });
        await setActive({ session: signInAttempt.createdSessionId });
        return;
      }
      console.error(JSON.stringify(signInAttempt, null, 2));
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

  async function onSocialPress(strategy: 'oauth_google' | 'oauth_apple') {
    try {
      const { createdSessionId, setActive: setSSOActive } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId && setSSOActive) setSSOActive({ session: createdSessionId });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }

  return (
    <View style={{ gap: 0 }}>
      {/* ── Logo + title ── */}
      <View className="mb-8 items-center">
        <View
          className="mb-5 items-center justify-center rounded-[20px]"
          style={{ width: 72, height: 72, backgroundColor: '#1A0E05' }}>
          <Zap size={34} color="#E8622A" fill="#E8622A" />
        </View>
        <Text
          className="mb-1.5 text-center text-white"
          style={{ fontSize: 44, fontWeight: '900', letterSpacing: 6 }}>
          TKD STRIKE
        </Text>
        <Text
          className="text-center"
          style={{ color: '#8A9BB0', fontSize: 12, fontWeight: '700', letterSpacing: 3 }}>
          TRAIN HARD. STRIKE FAST.
        </Text>
      </View>

      {/* ── Email ── */}
      <View className="mb-4">
        <Text
          className="mb-2"
          style={{ color: '#C0C8D4', fontSize: 11, fontWeight: '700', letterSpacing: 2 }}>
          EMAIL ADDRESS
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="name@athlete.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            height: 56,
            paddingHorizontal: 18,
            fontSize: 15,
            color: '#111',
          }}
        />
        {!!error.email && <Text className="mt-1.5 text-xs text-red-400">{error.email}</Text>}
      </View>

      {/* ── Password ── */}
      <View className="mb-2">
        <Text
          className="mb-2"
          style={{ color: '#C0C8D4', fontSize: 11, fontWeight: '700', letterSpacing: 2 }}>
          PASSWORD
        </Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            ref={passwordInputRef}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            returnKeyType="send"
            onSubmitEditing={onSubmit}
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              height: 56,
              paddingHorizontal: 18,
              paddingRight: 52,
              fontSize: 15,
              color: '#111',
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            style={{ position: 'absolute', right: 16, top: 16 }}
            hitSlop={8}>
            {showPassword ? (
              <EyeOff size={22} color="#6B7280" />
            ) : (
              <Eye size={22} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>
        {!!error.password && <Text className="mt-1.5 text-xs text-red-400">{error.password}</Text>}
      </View>

      {/* ── Forgot password ── */}
      <View className="mb-6 items-end">
        <Link href={`/(auth)/forgot-password?email=${email}`} asChild>
          <TouchableOpacity hitSlop={8}>
            <Text style={{ color: '#E8622A', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 }}>
              FORGOT PASSWORD?
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* ── Sign in button ── */}
      <TouchableOpacity
        onPress={onSubmit}
        activeOpacity={0.85}
        className="mb-6 items-center justify-center rounded-[16px]"
        style={{ backgroundColor: '#E8622A', height: 58 }}>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 2 }}>
          SIGN IN
        </Text>
      </TouchableOpacity>

      {/* ── OR divider ── */}
      <View className="mb-5 flex-row items-center gap-3">
        <View className="h-px flex-1" style={{ backgroundColor: '#2D2015' }} />
        <Text style={{ color: '#4B5563', fontSize: 11, fontWeight: '700', letterSpacing: 2 }}>
          OR CONTINUE WITH
        </Text>
        <View className="h-px flex-1" style={{ backgroundColor: '#2D2015' }} />
      </View>

      {/* ── Social buttons ── */}
      <View className="mb-7 flex-row gap-3">
        <TouchableOpacity
          onPress={() => onSocialPress('oauth_google')}
          activeOpacity={0.8}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-[14px]"
          style={{
            backgroundColor: '#1A1008',
            height: 52,
            borderWidth: 1,
            borderColor: '#2D2015',
          }}>
          <Image
            source={{ uri: 'https://img.clerk.com/static/google.png?width=80' }}
            style={{ width: 18, height: 18 }}
          />
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 }}>
            GOOGLE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSocialPress('oauth_apple')}
          activeOpacity={0.8}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-[14px]"
          style={{
            backgroundColor: '#1A1008',
            height: 52,
            borderWidth: 1,
            borderColor: '#2D2015',
          }}>
          <Text style={{ color: '#fff', fontSize: 15 }}>iOS</Text>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 }}>
            APPLE
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Join now ── */}
      <View className="mb-8 flex-row items-center justify-center gap-1">
        <Text style={{ color: '#9CA3AF', fontSize: 14 }}>New to the dojo?</Text>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity hitSlop={8}>
            <Text style={{ color: '#E8622A', fontSize: 14, fontWeight: '800' }}> JOIN NOW</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* ── Footer ── */}
      <Text
        className="text-center"
        style={{ color: '#3D3020', fontSize: 10, fontWeight: '700', letterSpacing: 2 }}>
        MASTERY THROUGH DISCIPLINE • TKD STRIKE V2.4
      </Text>
    </View>
  );
}
