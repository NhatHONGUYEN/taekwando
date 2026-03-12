import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { usePlaylists } from '@/features/playlists/hooks/usePlaylists';
import { useAddExerciseToPlaylist } from '@/features/playlists/hooks/useAddExerciseToPlaylist';
import type { Exercise } from '../types';

type Props = {
  exercise: Exercise | null;
  onClose: () => void;
};

export function AddToPlaylistModal({ exercise, onClose }: Props) {
  const { data: playlists, isLoading } = usePlaylists();
  const { mutate, isPending, variables } = useAddExerciseToPlaylist();

  const handleAdd = (playlistId: string) => {
    if (!exercise) return;
    mutate({ playlistId, exerciseId: exercise._id }, { onSuccess: onClose });
  };

  return (
    <Modal visible={!!exercise} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6 shadow-lg">
          <Text className="mb-1 text-xl font-bold">Add to playlist</Text>
          <Text className="mb-5 text-sm text-gray-500">{exercise?.name}</Text>

          {isLoading ? (
            <ActivityIndicator className="my-6" />
          ) : !playlists || playlists.length === 0 ? (
            <Text className="py-6 text-center text-gray-500">
              No playlists yet. Create one first.
            </Text>
          ) : (
            <FlatList
              data={playlists}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const isAdding = isPending && variables?.playlistId === item._id;
                return (
                  <TouchableOpacity
                    onPress={() => handleAdd(item._id)}
                    disabled={isPending}
                    className="mb-2 flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <View>
                      <Text className="font-medium text-gray-900">{item.name}</Text>
                      <Text className="text-xs text-gray-500">
                        {item.items.length} exercice{item.items.length > 1 ? 's' : ''}
                      </Text>
                    </View>
                    {isAdding ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      <Text className="text-sm font-medium text-black">+ Add</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}

          <TouchableOpacity
            onPress={onClose}
            className="mt-3 items-center rounded-xl border border-gray-200 py-3">
            <Text className="font-medium text-gray-600">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
