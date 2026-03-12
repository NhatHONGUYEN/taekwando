import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { usePlaylists } from '@/features/playlists/hooks/usePlaylists';
import { PlaylistCard } from '@/features/playlists/components/PlaylistCard';
import { CreatePlaylistModal } from '@/features/playlists/components/CreatePlaylistModal';

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
