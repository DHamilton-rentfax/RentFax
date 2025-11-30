import { makeHash } from "./hash";

export function buildTimelineHash(events: any[]) {
  const cleaned = events.map(e => ({
    action: e.action,
    timestamp: e.createdAt,
    actorId: e.actorId
  }));

  return makeHash(cleaned);
}
