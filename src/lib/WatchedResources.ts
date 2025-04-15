// lib/WatchedResources.ts

type WatchedKey = string; // e.g., `${agent_name}:${plural}`

const watchedResources = new Set<WatchedKey>();

export function hasWatched(agent: string, plural: string) {
  return watchedResources.has(`${agent}:${plural}`);
}

export function setWatched(agent: string, plural: string) {
  watchedResources.add(`${agent}:${plural}`);
}
