import type { CreateSessionPayload, SessionRuntimeItem } from '../types/session.types';

export function mapRuntimeToPayload(
  items: SessionRuntimeItem[],
  startedAt: Date,
  endedAt: Date = new Date(),
  notes?: string
): CreateSessionPayload {
  const durationSec = Math.round((endedAt.getTime() - startedAt.getTime()) / 1000);

  return {
    performedAt: startedAt.toISOString(),
    durationSec,
    notes,
    items: items.map(({ exerciseId, completed, repsDone, workSecDone, rpe, pain }) => ({
      exerciseId,
      completed,
      ...(repsDone !== undefined && { repsDone }),
      ...(workSecDone !== undefined && { workSecDone }),
      ...(rpe !== undefined && { rpe }),
      ...(pain !== undefined && { pain }),
    })),
  };
}
