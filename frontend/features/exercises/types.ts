export type ExerciseImage = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type ExerciseCategory =
  | 'technique'
  | 'poomsae'
  | 'sparring'
  | 'mobility'
  | 'flexibility'
  | 'strength';

export type PaginatedExercises = {
  items: Exercise[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type Exercise = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: ExerciseCategory;
  level: number;
  focus: string[];
  equipment: string[];
  tags: string[];
  image: ExerciseImage;
  instructions: string[];
  commonMistakes: string[];
  safetyNotes: string[];
  durationSecDefault: number;
  repsDefault?: number;
  restSecDefault: number;
  caloriesEstimate?: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};
