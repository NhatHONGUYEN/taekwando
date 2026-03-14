import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useCreatePlaylist } from '../hooks/useCreatePlaylist';

const BRAND = '#E8622A';
const SURFACE = '#1A1008';
const INPUT_BG = '#231810';
const BORDER = '#2D2015';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function CreatePlaylistModal({ visible, onClose }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { mutate, isPending } = useCreatePlaylist();

  const handleSubmit = () => {
    if (!name.trim()) return;
    mutate(
      { name: name.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={handleClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <View
          style={{
            backgroundColor: SURFACE,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 40,
          }}>
          {/* Drag handle */}
          <View
            style={{
              width: 36,
              height: 4,
              backgroundColor: BORDER,
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 20,
            }}
          />

          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 20, marginBottom: 20 }}>
            New Playlist
          </Text>

          <Text style={{ color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
            NAME *
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Morning warm-up"
            placeholderTextColor="#4B5563"
            autoFocus
            style={{
              backgroundColor: INPUT_BG,
              borderWidth: 1,
              borderColor: BORDER,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              color: '#fff',
              marginBottom: 16,
            }}
          />

          <Text style={{ color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
            DESCRIPTION
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Optional description"
            placeholderTextColor="#4B5563"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{
              backgroundColor: INPUT_BG,
              borderWidth: 1,
              borderColor: BORDER,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              color: '#fff',
              marginBottom: 24,
              minHeight: 80,
            }}
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={handleClose}
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
              onPress={handleSubmit}
              disabled={!name.trim() || isPending}
              style={{
                flex: 1,
                alignItems: 'center',
                borderRadius: 12,
                paddingVertical: 14,
                backgroundColor: !name.trim() || isPending ? '#4B2010' : BRAND,
              }}>
              {isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '700' }}>Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
