import type { Exercise } from '@/features/exercises/types';

export type PainScore = {
  hip?: number;
  knee?: number;
  lowerBack?: number;
};

// ─── Backend shapes ────────────────────────────────────────────────────────────

export type SessionItemPayload = {
  exerciseId: string;
  completed?: boolean;
  repsDone?: number;
  workSecDone?: number;
  rpe?: number;
  pain?: PainScore;
};

export type CreateSessionPayload = {
  performedAt?: string;
  durationSec: number;
  items: SessionItemPayload[];
  notes?: string;
};

export type SessionItem = {
  exerciseId: string;
  completed: boolean;
  repsDone?: number;
  workSecDone?: number;
  rpe?: number;
  pain?: PainScore;
};

export type SessionItemPopulated = Omit<SessionItem, 'exerciseId'> & {
  exerciseId: Exercise;
};

export type Session = {
  _id: string;
  clerkUserId: string;
  performedAt: string;
  durationSec: number;
  items: SessionItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type SessionPopulated = Omit<Session, 'items'> & {
  items: SessionItemPopulated[];
};

// ─── Runtime (Zustand store) ───────────────────────────────────────────────────

export type SessionStatus = 'idle' | 'running' | 'paused' | 'finished';

export type SessionRuntimeItem = {
  exerciseId: string;
  exerciseName: string;
  exerciseSlug: string;
  targetDurationSec: number;
  // filled by user during session
  completed: boolean;
  repsDone?: number;
  workSecDone?: number;
  rpe?: number;
  pain?: PainScore;
};
