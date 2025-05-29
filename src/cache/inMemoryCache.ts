// Centralized in-memory cache (shared across modules)
export const inMemoryCache = new Map<string, { data: any; timestamp: number }>();

// Optional: utility to clear cache
export const clearInMemoryCache = () => {
  inMemoryCache.clear();
};
