import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { usePlaylists } from '@/features/playlists/hooks/usePlaylists';
import { PlaylistCard } from '@/features/playlists/components/PlaylistCard';
import { CreatePlaylistModal } from '@/features/playlists/components/CreatePlaylistModal';
import { EditPlaylistModal } from '@/features/playlists/components/EditPlaylistModal';
import type { Playlist } from '@/features/playlists/types';
import { Plus, ListMusic } from 'lucide-react-native';

const BRAND = '#E8622A';
const BG = '#0D0905';
const SURFACE = '#1A1008';
const BORDER = '#2D2015';

export default function PlaylistsScreen() {
  const { data, isLoading } = usePlaylists();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <CreatePlaylistModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      <EditPlaylistModal playlist={editingPlaylist} onClose={() => setEditingPlaylist(null)} />

      {/* ── Header ── */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 22, letterSpacing: 0.5 }}>
          My Playlists
        </Text>
      </View>

      {/* ── Create button ── */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
          style={{
            backgroundColor: BRAND,
            borderRadius: 14,
            height: 52,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
          <Plus size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
            Create New Playlist
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#6B7280' }}>Loading playlists...</Text>
        </View>
      ) : !data || data.length === 0 ? (
        // ── Empty state ──
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}>
          <View
            style={{
              width: '100%',
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: BORDER,
              borderStyle: 'dashed',
              alignItems: 'center',
              paddingVertical: 48,
              paddingHorizontal: 24,
            }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: SURFACE,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
              <ListMusic size={28} color="#4B5563" />
            </View>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18, marginBottom: 8 }}>
              No custom playlists yet
            </Text>
            <Text
              style={{
                color: '#6B7280',
                fontSize: 13,
                textAlign: 'center',
                lineHeight: 20,
                marginBottom: 20,
              }}>
              Create your first personalized training set to track your progress.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Plus size={14} color={BRAND} />
              <Text style={{ color: BRAND, fontWeight: '700', fontSize: 14 }}>
                Build my first playlist
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PlaylistCard playlist={item} onEdit={setEditingPlaylist} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                Custom Playlists
              </Text>
              <View
                style={{
                  backgroundColor: SURFACE,
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                }}>
                <Text style={{ color: '#9CA3AF', fontSize: 12, fontWeight: '600' }}>
                  {data.length} Total
                </Text>
              </View>
            </View>
          }
        />
      )}
    </View>
  );
}
