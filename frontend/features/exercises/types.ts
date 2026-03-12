export type ExerciseVideo = {
  url: string;
  publicId: string;
  durationSec?: number;
  format?: string;
  bytes?: number;
  thumbnailUrl?: string;
};

export type ExerciseCategory = 'mobility' | 'flexibility' | 'strength';

export type Exercise = {
  _id: string;
  name: string;
  slug: string;
  category: ExerciseCategory;
  level: number;
  focus: string[];
  equipment: string[];
  durationSecDefault: number;
  instructions: string[];
  commonMistakes: string[];
  safetyNotes: string[];
  video?: ExerciseVideo;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};
