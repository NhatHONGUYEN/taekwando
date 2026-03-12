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
} from 'react-native';
import { useUpdatePlaylist } from '../hooks/useUpdatePlaylist';
import type { Playlist } from '../types';

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end">
        <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6 shadow-lg">
          <Text className="mb-6 text-xl font-bold">Edit playlist</Text>

          <Text className="mb-1 text-sm font-medium text-gray-700">Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Morning warm-up"
            className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base"
            autoFocus
          />

          <Text className="mb-1 text-sm font-medium text-gray-700">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Optional description"
            className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 items-center rounded-xl border border-gray-200 py-3">
              <Text className="font-medium text-gray-600">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!name.trim() || isPending}
              className={`flex-1 items-center rounded-xl py-3 ${
                !name.trim() || isPending ? 'bg-gray-300' : 'bg-black'
              }`}>
              {isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="font-medium text-white">Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
