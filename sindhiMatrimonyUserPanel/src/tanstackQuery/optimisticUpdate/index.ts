import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { queryClient as defaultQueryClient } from '../client';
import { QUERY_KEYS } from '../keys';

// =============================================================================
// ⚡ TANSTACK QUERY OPTIMISTIC UPDATE ENGINE (Equivalent to Redux Action/optimisticUpdate.ts)
// =============================================================================

export interface QuerySnapshot {
  queryKey: readonly unknown[];
  data: unknown;
}

/**
 * 🎯 Robust Identity Matcher for any Candidate or Entity
 * Supports `_id`, `id`, `matrimonyId` (with digit normalization), `receiverProfileId`, etc.
 */
export const isItemMatch = (item: any, id: string): boolean => {
  if (!item || !id) return false;
  const target = String(id).trim().toLowerCase();
  if (!target) return false;

  const targetDigits = target.replace(/\D/g, '');

  const itemId = item._id ? String(item._id).trim().toLowerCase() : '';
  const altId = item.id ? String(item.id).trim().toLowerCase() : '';
  const matId = item.matrimonyId ? String(item.matrimonyId).trim().toLowerCase() : '';
  const matDigits = matId ? matId.replace(/\D/g, '') : '';
  const recId = item.receiverProfileId ? String(item.receiverProfileId).trim().toLowerCase() : '';
  const recSubId = item.receiverProfile?._id ? String(item.receiverProfile._id).trim().toLowerCase() : '';
  const senderId = item.senderProfileId ? String(item.senderProfileId).trim().toLowerCase() : '';
  const senderSubId = item.senderProfile?._id ? String(item.senderProfile._id).trim().toLowerCase() : '';
  const candId = item.candidateId ? String(item.candidateId).trim().toLowerCase() : '';

  return (
    itemId === target ||
    altId === target ||
    matId === target ||
    (targetDigits.length >= 4 && matDigits === targetDigits) ||
    recId === target ||
    recSubId === target ||
    senderId === target ||
    senderSubId === target ||
    candId === target
  );
};

const COMMON_ARRAY_KEYS = [
  'list',
  'items',
  'candidates',
  'interests',
  'matches',
  'viewedProfiles',
  'profiles',
  'conversations',
  'notifications',
  'reviews',
  'stories',
] as const;

/**
 * 🔄 Deeply updates an item in any collection (flat array, paginated object, or infinite query pages)
 */
export const updateAnyList = (
  container: any,
  updater: (item: any) => any,
  matcher: (item: any) => boolean,
): any => {
  if (!container) return container;

  // 1. Direct Array
  if (Array.isArray(container)) {
    return container.map((item) => (matcher(item) ? updater(item) : item));
  }

  // 2. Object with collections
  if (typeof container === 'object') {
    let modified = false;
    const result: any = { ...container };

    for (const key of COMMON_ARRAY_KEYS) {
      if (Array.isArray(container[key])) {
        result[key] = container[key].map((item: any) =>
          matcher(item) ? updater(item) : item,
        );
        modified = true;
      }
    }

    // Nested data wrapper
    if (container.data && typeof container.data === 'object') {
      result.data = updateAnyList(container.data, updater, matcher);
      modified = true;
    }

    // Infinite Query pages wrapper
    if (Array.isArray(container.pages)) {
      result.pages = container.pages.map((page: any) =>
        updateAnyList(page, updater, matcher),
      );
      modified = true;
    }

    return modified ? result : container;
  }

  return container;
};

/**
 * 🗑️ Deeply removes an item from any collection (flat array, paginated object, or infinite query pages)
 */
export const removeAnyList = (
  container: any,
  matcher: (item: any) => boolean,
): any => {
  if (!container) return container;

  // 1. Direct Array
  if (Array.isArray(container)) {
    return container.filter((item) => !matcher(item));
  }

  // 2. Object with collections
  if (typeof container === 'object') {
    let modified = false;
    const result: any = { ...container };

    for (const key of COMMON_ARRAY_KEYS) {
      if (Array.isArray(container[key])) {
        result[key] = container[key].filter((item: any) => !matcher(item));
        if (typeof result.total === 'number') {
          result.total = Math.max(0, result.total - 1);
        }
        if (typeof result.totalMatchesCount === 'number') {
          result.totalMatchesCount = Math.max(0, result.totalMatchesCount - 1);
        }
        if (typeof result.totalShortlisted === 'number') {
          result.totalShortlisted = Math.max(0, result.totalShortlisted - 1);
        }
        modified = true;
      }
    }

    if (container.data && typeof container.data === 'object') {
      result.data = removeAnyList(container.data, matcher);
      modified = true;
    }

    if (Array.isArray(container.pages)) {
      result.pages = container.pages.map((page: any) =>
        removeAnyList(page, matcher),
      );
      modified = true;
    }

    return modified ? result : container;
  }

  return container;
};

/**
 * ➕ Deeply adds an item into any collection (flat array, paginated object, or infinite query pages)
 */
export const addAnyList = (
  container: any,
  newItem: any,
  prepend = true,
): any => {
  if (!container) return container;

  // 1. Direct Array
  if (Array.isArray(container)) {
    return prepend ? [newItem, ...container] : [...container, newItem];
  }

  // 2. Object with collections
  if (typeof container === 'object') {
    let modified = false;
    const result: any = { ...container };

    for (const key of COMMON_ARRAY_KEYS) {
      if (Array.isArray(container[key])) {
        result[key] = prepend
          ? [newItem, ...container[key]]
          : [...container[key], newItem];
        if (typeof result.total === 'number') result.total += 1;
        if (typeof result.totalMatchesCount === 'number') result.totalMatchesCount += 1;
        if (typeof result.totalShortlisted === 'number') result.totalShortlisted += 1;
        modified = true;
      }
    }

    if (container.data && typeof container.data === 'object') {
      result.data = addAnyList(container.data, newItem, prepend);
      modified = true;
    }

    if (Array.isArray(container.pages) && container.pages.length > 0) {
      const targetIdx = prepend ? 0 : container.pages.length - 1;
      result.pages = container.pages.map((page: any, idx: number) => {
        if (idx !== targetIdx) return page;
        return addAnyList(page, newItem, prepend);
      });
      modified = true;
    }

    return modified ? result : container;
  }

  return container;
};

/**
 * ⚡ Update single object/profile cache directly WITHOUT calling GET API
 */
export const updateQueryCache = <T = any>(
  queryKey: readonly any[] | any[],
  updaterOrPartial: Partial<T> | ((oldData: T) => T),
  client: QueryClient = defaultQueryClient,
) => {
  client.setQueriesData({ queryKey: queryKey as any }, (oldData: any) => {
    if (!oldData) {
      return typeof updaterOrPartial === 'function'
        ? (updaterOrPartial as any)(null)
        : updaterOrPartial;
    }

    if (typeof updaterOrPartial === 'function') {
      return (updaterOrPartial as any)(oldData);
    }

    // Nested data response check
    if (
      oldData &&
      typeof oldData === 'object' &&
      'data' in oldData &&
      oldData.data &&
      typeof oldData.data === 'object' &&
      !Array.isArray(oldData.data)
    ) {
      return {
        ...oldData,
        data: {
          ...oldData.data,
          ...updaterOrPartial,
        },
      };
    }

    return {
      ...oldData,
      ...updaterOrPartial,
    };
  });
};

/**
 * ⚡ Update an item in all matching queries by id / _id / matrimonyId
 * Uses setQueriesData so prefixes like ['matches'] automatically update ALL match feeds!
 */
export const updateItemInQueryCache = (
  queryKey: readonly any[] | any[],
  id: string,
  partialDataOrUpdater: Record<string, any> | ((oldItem: any) => Record<string, any>),
  client: QueryClient = defaultQueryClient,
) => {
  const matcher = (item: any) => isItemMatch(item, id);
  const updater = (item: any) => {
    const patch =
      typeof partialDataOrUpdater === 'function'
        ? partialDataOrUpdater(item)
        : partialDataOrUpdater;
    return { ...item, ...patch };
  };

  client.setQueriesData({ queryKey: queryKey as any }, (oldData: any) => {
    return updateAnyList(oldData, updater, matcher);
  });
};

/**
 * ⚡ Remove an item from all matching queries by id / _id / matrimonyId
 */
export const removeItemFromQueryCache = (
  queryKey: readonly any[] | any[],
  id: string,
  client: QueryClient = defaultQueryClient,
) => {
  const matcher = (item: any) => isItemMatch(item, id);

  client.setQueriesData({ queryKey: queryKey as any }, (oldData: any) => {
    return removeAnyList(oldData, matcher);
  });
};

/**
 * ⚡ Add a new item into all matching queries
 */
export const addItemToQueryCache = (
  queryKey: readonly any[] | any[],
  item: Record<string, any>,
  prepend = true,
  client: QueryClient = defaultQueryClient,
) => {
  client.setQueriesData({ queryKey: queryKey as any }, (oldData: any) => {
    return addAnyList(oldData, item, prepend);
  });
};

/**
 * 📸 Snapshot all queries starting with queryKey for automatic rollback on mutation error
 */
export const snapshotQueries = async (
  queryKeys: (readonly any[] | any[])[],
  client: QueryClient = defaultQueryClient,
): Promise<QuerySnapshot[]> => {
  const snapshots: QuerySnapshot[] = [];
  const seenKeys = new Set<string>();

  for (const qKey of queryKeys) {
    if (!qKey) continue;
    try {
      await client.cancelQueries({ queryKey: qKey as any });
      const matching = client.getQueriesData({ queryKey: qKey as any });
      for (const [key, data] of matching) {
        const serialized = JSON.stringify(key);
        if (!seenKeys.has(serialized)) {
          seenKeys.add(serialized);
          snapshots.push({ queryKey: key, data });
        }
      }
    } catch (e) {
      console.warn('Error taking query snapshot:', e);
    }
  }

  return snapshots;
};

/**
 * ⏪ Rollback all queries from snapshot on error
 */
export const rollbackQueries = (
  snapshots: QuerySnapshot[],
  client: QueryClient = defaultQueryClient,
) => {
  if (!Array.isArray(snapshots)) return;
  for (const snap of snapshots) {
    client.setQueryData(snap.queryKey as any, snap.data);
  }
};

/**
 * ⚡ React hook for updating TanStack Query cache inside components
 */
export const useUpdateQueryCache = () => {
  const client = useQueryClient();

  return {
    updateCache: <T = any>(queryKey: readonly any[] | any[], updater: Partial<T> | ((old: T) => T)) =>
      updateQueryCache(queryKey, updater, client),

    updateItem: (
      queryKey: readonly any[] | any[],
      id: string,
      partialDataOrUpdater: Record<string, any> | ((oldItem: any) => Record<string, any>),
    ) => updateItemInQueryCache(queryKey, id, partialDataOrUpdater, client),

    removeItem: (queryKey: readonly any[] | any[], id: string) =>
      removeItemFromQueryCache(queryKey, id, client),

    addItem: (queryKey: readonly any[] | any[], item: Record<string, any>, prepend = true) =>
      addItemToQueryCache(queryKey, item, prepend, client),

    snapshot: (queryKeys: (readonly any[] | any[])[]) =>
      snapshotQueries(queryKeys, client),

    rollback: (snapshots: QuerySnapshot[]) =>
      rollbackQueries(snapshots, client),

    invalidate: (queryKey: readonly any[] | any[]) =>
      client.invalidateQueries({ queryKey: queryKey as any }),
  };
};

export default useUpdateQueryCache;
