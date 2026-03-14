import { create } from 'zustand';
import type { SessionRuntimeItem, SessionStatus, PainScore } from '../types/session.types';

type UpdateCurrentExerciseData = Partial<
  Pick<SessionRuntimeItem, 'completed' | 'repsDone' | 'workSecDone' | 'rpe' | 'pain'>
>;

type SessionStore = {
  // ─── State ──────────────────────────────────────────────────────────────────
  items: SessionRuntimeItem[];
  currentIndex: number;
  status: SessionStatus;
  secondsLeft: number;
  startedAt: Date | null;

  // ─── Actions ────────────────────────────────────────────────────────────────
  startSession: (items: SessionRuntimeItem[]) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  tick: () => void;
  updateCurrentExercise: (data: UpdateCurrentExerciseData) => void;
  nextExercise: () => void;
  previousExercise: () => void;
  finishSession: () => void;
  resetSession: () => void;
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  items: [],
  currentIndex: 0,
  status: 'idle',
  secondsLeft: 0,
  startedAt: null,

  startSession: (items) =>
    set({
      items,
      currentIndex: 0,
      status: 'running',
      secondsLeft: items[0]?.targetDurationSec ?? 0,
      startedAt: new Date(),
    }),

  pauseSession: () => set({ status: 'paused' }),

  resumeSession: () => set({ status: 'running' }),

  tick: () => {
    const { secondsLeft, status } = get();
    if (status !== 'running') return;
    set({ secondsLeft: Math.max(0, secondsLeft - 1) });
  },

  updateCurrentExercise: (data) => {
    const { items, currentIndex } = get();
    const updated = items.map((item, i) => (i === currentIndex ? { ...item, ...data } : item));
    set({ items: updated });
  },

  nextExercise: () => {
    const { currentIndex, items } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex >= items.length) {
      set({ status: 'finished' });
      return;
    }
    set({
      currentIndex: nextIndex,
      secondsLeft: items[nextIndex].targetDurationSec,
    });
  },

  previousExercise: () => {
    const { currentIndex, items } = get();
    const prevIndex = Math.max(0, currentIndex - 1);
    set({
      currentIndex: prevIndex,
      secondsLeft: items[prevIndex].targetDurationSec,
    });
  },

  finishSession: () => set({ status: 'finished' }),

  resetSession: () =>
    set({
      items: [],
      currentIndex: 0,
      status: 'idle',
      secondsLeft: 0,
      startedAt: null,
    }),
}));
