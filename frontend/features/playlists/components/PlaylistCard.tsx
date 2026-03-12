import { View, Text } from 'react-native';
import type { Playlist } from '../types';

type Props = {
  playlist: Playlist;
};

export function PlaylistCard({ playlist }: Props) {
  return (
    <View className="mb-3 rounded-2xl border border-gray-200 bg-white p-4">
      <Text className="text-lg font-semibold">{playlist.name}</Text>
      {!!playlist.description && (
        <Text className="mt-1 text-sm text-gray-600">{playlist.description}</Text>
      )}
      <Text className="mt-2 text-sm text-gray-500">
        {playlist.items.length} exercice{playlist.items.length > 1 ? 's' : ''}
      </Text>
    </View>
  );
}
