import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDeletePlaylist } from '../hooks/useDeletePlaylist';
import type { Playlist } from '../types';

type Props = {
  playlist: Playlist;
  onEdit: (playlist: Playlist) => void;
};

export function PlaylistCard({ playlist, onEdit }: Props) {
  const router = useRouter();
  const { mutate: deletePlaylist, isPending } = useDeletePlaylist();

  const handleDelete = () => {
    Alert.alert('Delete playlist', `Are you sure you want to delete "${playlist.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deletePlaylist(playlist._id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: '/(protected)/playlist/[id]', params: { id: playlist._id } })
      }
      className="mb-3 rounded-2xl border border-gray-200 bg-white p-4"
      activeOpacity={0.7}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold">{playlist.name}</Text>
          {!!playlist.description && (
            <Text className="mt-1 text-sm text-gray-600">{playlist.description}</Text>
          )}
          <Text className="mt-2 text-sm text-gray-500">
            {playlist.items.length} exercice{playlist.items.length > 1 ? 's' : ''}
          </Text>
        </View>

        <View className="ml-3 flex-row gap-2">
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onEdit(playlist);
            }}
            className="rounded-lg bg-gray-100 px-3 py-2">
            <Text className="text-sm font-medium text-gray-700">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isPending}
            className="rounded-lg bg-red-50 px-3 py-2">
            <Text className="text-sm font-medium text-red-600">{isPending ? '...' : 'Delete'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
