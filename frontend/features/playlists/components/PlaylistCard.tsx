import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Pencil, Trash2, Clock, Dumbbell } from 'lucide-react-native';
import { useDeletePlaylist } from '../hooks/useDeletePlaylist';
import type { Playlist } from '../types';

const BRAND = '#E8622A';
const SURFACE = '#1A1008';
const BORDER = '#2D2015';

// Pick a cover image from the first exercise if populated, otherwise a placeholder
const PLACEHOLDER = 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800';

type Props = {
  playlist: Playlist;
  onEdit: (playlist: Playlist) => void;
};

export function PlaylistCard({ playlist, onEdit }: Props) {
  const router = useRouter();
  const { mutate: deletePlaylist, isPending } = useDeletePlaylist();

  const totalSec = playlist.items.length * 45;
  const mins = Math.max(1, Math.round(totalSec / 60));

  const handleDelete = () => {
    Alert.alert('Delete playlist', `Delete "${playlist.name}"?`, [
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
      activeOpacity={0.85}
      onPress={() =>
        router.push({ pathname: '/(protected)/playlist/[id]', params: { id: playlist._id } })
      }
      style={{ backgroundColor: SURFACE, borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
      {/* ── Cover image ── */}
      <Image
        source={{ uri: PLACEHOLDER }}
        style={{ width: '100%', height: 160 }}
        resizeMode="cover"
      />

      {/* ── Info ── */}
      <View style={{ padding: 14 }}>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16, marginBottom: 6 }}>
          {playlist.name}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Dumbbell size={13} color="#6B7280" />
            <Text style={{ color: '#6B7280', fontSize: 13 }}>
              {playlist.items.length} Exercise{playlist.items.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Clock size={13} color="#6B7280" />
            <Text style={{ color: '#6B7280', fontSize: 13 }}>{mins} min</Text>
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Start */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.push({ pathname: '/(protected)/playlist/[id]', params: { id: playlist._id } })
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: BRAND,
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}>
            <Play size={13} color="#fff" fill="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Start</Text>
          </TouchableOpacity>

          {/* Edit */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onEdit(playlist);
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#2D2015',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Pencil size={16} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isPending}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#2D2015',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Trash2 size={16} color={isPending ? '#6B7280' : '#EF4444'} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
