export type PlaylistItem = {
  exerciseId: string;
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
