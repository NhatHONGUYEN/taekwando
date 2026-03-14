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
      {/* Backdrop */}
      <TouchableOpacity
        className="flex-1"
        activeOpacity={1}
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onPress={onClose}
      />
      <View className="bg-tkd-surface rounded-t-3xl px-6 pb-10 pt-5">
        {/* Handle bar */}
        <View className="bg-tkd-border mb-4 h-1 w-10 self-center rounded-full" />

        <Text className="mb-0.5 text-[18px] font-black text-white">Add to playlist</Text>
        <Text className="text-brand mb-5 text-[12px] font-bold uppercase tracking-widest">
          {exercise?.name}
        </Text>

        {isLoading ? (
          <ActivityIndicator color="#E8622A" className="my-6" />
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
                  activeOpacity={0.75}
                  className="border-tkd-border mb-2 flex-row items-center justify-between rounded-2xl border px-4 py-3"
                  style={{ backgroundColor: '#0D0905' }}>
                  <View>
                    <Text className="text-[14px] font-bold text-white">{item.name}</Text>
                    <Text className="mt-0.5 text-xs text-gray-500">
                      {item.items.length} exercise{item.items.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  {isAdding ? (
                    <ActivityIndicator size="small" color="#E8622A" />
                  ) : (
                    <View className="bg-brand rounded-xl px-3 py-1.5">
                      <Text className="text-[12px] font-extrabold text-white">+ ADD</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}

        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.75}
          className="border-tkd-border mt-2 items-center rounded-2xl border py-3.5">
          <Text className="text-sm font-bold text-gray-500">Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
