import { SignInForm } from '@/components/sign-in-form';
import * as React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';

const BG_IMAGE = 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200';

export default function SignInScreen() {
  return (
    <ImageBackground source={{ uri: BG_IMAGE }} className="flex-1" resizeMode="cover">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View
        className="absolute bottom-0 left-0 right-0 top-0"
        style={{ backgroundColor: 'rgba(10,6,3,0.80)' }}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingTop: 64,
            paddingBottom: 32,
          }}>
          <SignInForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
