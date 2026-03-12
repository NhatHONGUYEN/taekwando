import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { usePlaylists } from '@/features/playlists/hooks/usePlaylists';
import { useCreatePlaylist } from '@/features/playlists/hooks/useCreatePlaylist';
import type { Playlist } from '@/features/playlists/types';

function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <View className="mb-3 rounded-2xl border border-gray-200 bg-white p-4">
      <Text className="text-lg font-semibold">{playlist.name}</Text>

      {playlist.description ? (
        <Text className="mt-1 text-sm text-gray-600">{playlist.description}</Text>
      ) : null}

      <Text className="mt-2 text-sm text-gray-500">
        {playlist.items.length} exercice{playlist.items.length > 1 ? 's' : ''}
      </Text>
    </View>
  );
}

function CreatePlaylistModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { mutate, isPending } = useCreatePlaylist();

  function handleSubmit() {
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
  }

  function handleClose() {
    setName('');
    setDescription('');
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end">
        <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6 shadow-lg">
          <Text className="mb-6 text-xl font-bold">New playlist</Text>

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
              onPress={handleClose}
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
                <Text className="font-medium text-white">Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function PlaylistsScreen() {
  const { data, isLoading, isError } = usePlaylists();
  const [modalVisible, setModalVisible] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text>Loading playlists...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text>Error loading playlists</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <CreatePlaylistModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {!data || data.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold">No playlists yet</Text>
          <Text className="mt-2 text-center text-gray-500">
            Create your first playlist to start organizing your exercises.
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="mt-6 rounded-xl bg-black px-6 py-3">
            <Text className="font-medium text-white">Create a playlist</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 px-4 pt-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold">My playlists</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="rounded-xl bg-black px-4 py-2">
              <Text className="text-sm font-medium text-white">+ New</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <PlaylistCard playlist={item} />}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}
