import { useState, useEffect } from 'react';
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
import { useUpdatePlaylist } from '../hooks/useUpdatePlaylist';
import type { Playlist } from '../types';

const BRAND = '#E8622A';
const SURFACE = '#1A1008';
const INPUT_BG = '#231810';
const BORDER = '#2D2015';

type Props = {
  playlist: Playlist | null;
  onClose: () => void;
};

export function EditPlaylistModal({ playlist, onClose }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { mutate, isPending } = useUpdatePlaylist();

  useEffect(() => {
    if (playlist) {
      setName(playlist.name);
      setDescription(playlist.description ?? '');
    }
  }, [playlist]);

  const handleSubmit = () => {
    if (!playlist || !name.trim()) return;
    mutate(
      { id: playlist._id, data: { name: name.trim(), description: description.trim() } },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal visible={!!playlist} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={onClose} />
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
            Edit Playlist
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
              onPress={onClose}
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
                <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
