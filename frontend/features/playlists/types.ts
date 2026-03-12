import type { Exercise } from '@/features/exercises/types';

export type PlaylistItem = {
  exerciseId: string | Exercise;
  order: number;
};

export type PlaylistItemPopulated = {
  exerciseId: Exercise;
  order: number;
};

export type Playlist = {
  _id: string;
  clerkUserId: string;
  name: string;
  description: string;
  isPublic: boolean;
  items: PlaylistItem[];
  createdAt: string;
  updatedAt: string;
};

export type PlaylistPopulated = Omit<Playlist, 'items'> & {
  items: PlaylistItemPopulated[];
};
