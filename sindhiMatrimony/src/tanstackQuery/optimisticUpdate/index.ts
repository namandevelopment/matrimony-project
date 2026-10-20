import { useQueryClient } from '@tanstack/react-query';
import { queryClient as defaultQueryClient } from '../client';

// =============================================================================
// OPTIMISTIC & DIRECT CACHE UPDATER (Equivalent to Redux Action/optimisticUpdate.ts)
// =============================================================================

/**
 * ⚡ Update single object/profile cache directly WITHOUT calling GET API
 */
export const updateQueryCache = <T = any>(
  queryKey: readonly any[] | any[],
  updaterOrPartial: Partial<T> | ((oldData: T) => T),
  client = defaultQueryClient,
) => {
  client.setQueryData(queryKey as any, (oldData: any) => {
    if (!oldData) {
      return typeof updaterOrPartial === 'function'
        ? (updaterOrPartial as any)(null)
        : updaterOrPartial;
    }

    if (typeof updaterOrPartial === 'function') {
      return (updaterOrPartial as any)(oldData);
    }

    // If data is nested under `data` key (common ApiResponse structure)
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
 * ⚡ Update a single candidate or item in a list or infinite scroll feed by id/_id
 */
export const updateItemInQueryCache = (
  queryKey: readonly any[] | any[],
  id: string,
  partialData: Record<string, any>,
  client = defaultQueryClient,
) => {
  client.setQueryData(queryKey as any, (oldData: any) => {
    if (!oldData) return oldData;

    // 1. Infinite Query structure ({ pages: [ { list: [...] } ] })
    if (oldData.pages && Array.isArray(oldData.pages)) {
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => {
          if (!page) return page;

          if (Array.isArray(page)) {
            return page.map(item =>
              (item?._id === id || item?.id === id) ? { ...item, ...partialData } : item,
            );
          }

          if (Array.isArray(page.list)) {
            return {
              ...page,
              list: page.list.map((item: any) =>
                (item?._id === id || item?.id === id) ? { ...item, ...partialData } : item,
              ),
            };
          }

          if (page.data && Array.isArray(page.data.list)) {
            return {
              ...page,
              data: {
                ...page.data,
                list: page.data.list.map((item: any) =>
                  (item?._id === id || item?.id === id) ? { ...item, ...partialData } : item,
                ),
              },
            };
          }

          return page;
        }),
      };
    }

    // 2. Regular flat array
    if (Array.isArray(oldData)) {
      return oldData.map(item =>
        (item?._id === id || item?.id === id) ? { ...item, ...partialData } : item,
      );
    }

    // 3. Object with list
    if (Array.isArray(oldData.list)) {
      return {
        ...oldData,
        list: oldData.list.map((item: any) =>
          (item?._id === id || item?.id === id) ? { ...item, ...partialData } : item,
        ),
      };
    }

    // 4. Object with data.list
    if (oldData.data && Array.isArray(oldData.data.list)) {
      return {
        ...oldData,
        data: {
          ...oldData.data,
          list: oldData.data.list.map((item: any) =>
            (item?._id === id || item?.id === id) ? { ...item, ...partialData } : item,
          ),
        },
      };
    }

    return oldData;
  });
};

/**
 * ⚡ Remove an item from a list or infinite feed by id/_id
 */
export const removeItemFromQueryCache = (
  queryKey: readonly any[] | any[],
  id: string,
  client = defaultQueryClient,
) => {
  client.setQueryData(queryKey as any, (oldData: any) => {
    if (!oldData) return oldData;

    // 1. Infinite Query
    if (oldData.pages && Array.isArray(oldData.pages)) {
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => {
          if (!page) return page;

          if (Array.isArray(page)) {
            return page.filter(item => item?._id !== id && item?.id !== id);
          }

          if (Array.isArray(page.list)) {
            return {
              ...page,
              list: page.list.filter((item: any) => item?._id !== id && item?.id !== id),
              total: typeof page.total === 'number' ? Math.max(0, page.total - 1) : page.total,
            };
          }

          if (page.data && Array.isArray(page.data.list)) {
            return {
              ...page,
              data: {
                ...page.data,
                list: page.data.list.filter((item: any) => item?._id !== id && item?.id !== id),
                total: typeof page.data.total === 'number' ? Math.max(0, page.data.total - 1) : page.data.total,
              },
            };
          }

          return page;
        }),
      };
    }

    // 2. Regular array
    if (Array.isArray(oldData)) {
      return oldData.filter(item => item?._id !== id && item?.id !== id);
    }

    // 3. Object with list
    if (Array.isArray(oldData.list)) {
      return {
        ...oldData,
        list: oldData.list.filter((item: any) => item?._id !== id && item?.id !== id),
      };
    }

    // 4. Object with data.list
    if (oldData.data && Array.isArray(oldData.data.list)) {
      return {
        ...oldData,
        data: {
          ...oldData.data,
          list: oldData.data.list.filter((item: any) => item?._id !== id && item?.id !== id),
        },
      };
    }

    return oldData;
  });
};

/**
 * ⚡ Add a new item into a list or infinite feed
 */
export const addItemToQueryCache = (
  queryKey: readonly any[] | any[],
  item: Record<string, any>,
  prepend = true,
  client = defaultQueryClient,
) => {
  client.setQueryData(queryKey as any, (oldData: any) => {
    if (!oldData) return oldData;

    // 1. Infinite Query -> add to first page (if prepend) or last page
    if (oldData.pages && Array.isArray(oldData.pages) && oldData.pages.length > 0) {
      const targetPageIndex = prepend ? 0 : oldData.pages.length - 1;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any, idx: number) => {
          if (idx !== targetPageIndex) return page;

          if (Array.isArray(page)) {
            return prepend ? [item, ...page] : [...page, item];
          }

          if (Array.isArray(page.list)) {
            return {
              ...page,
              list: prepend ? [item, ...page.list] : [...page.list, item],
              total: typeof page.total === 'number' ? page.total + 1 : page.total,
            };
          }

          if (page.data && Array.isArray(page.data.list)) {
            return {
              ...page,
              data: {
                ...page.data,
                list: prepend ? [item, ...page.data.list] : [...page.data.list, item],
                total: typeof page.data.total === 'number' ? page.data.total + 1 : page.data.total,
              },
            };
          }

          return page;
        }),
      };
    }

    if (Array.isArray(oldData)) {
      return prepend ? [item, ...oldData] : [...oldData, item];
    }

    if (Array.isArray(oldData.list)) {
      return {
        ...oldData,
        list: prepend ? [item, ...oldData.list] : [...oldData.list, item],
      };
    }

    if (oldData.data && Array.isArray(oldData.data.list)) {
      return {
        ...oldData,
        data: {
          ...oldData.data,
          list: prepend ? [item, ...oldData.data.list] : [...oldData.data.list, item],
        },
      };
    }

    return oldData;
  });
};

/**
 * ⚡ React hook for updating TanStack Query cache inside components
 */
export const useUpdateQueryCache = () => {
  const client = useQueryClient();

  return {
    updateCache: <T = any>(queryKey: readonly any[] | any[], updater: Partial<T> | ((old: T) => T)) =>
      updateQueryCache(queryKey, updater, client),

    updateItem: (queryKey: readonly any[] | any[], id: string, partialData: Record<string, any>) =>
      updateItemInQueryCache(queryKey, id, partialData, client),

    removeItem: (queryKey: readonly any[] | any[], id: string) =>
      removeItemFromQueryCache(queryKey, id, client),

    addItem: (queryKey: readonly any[] | any[], item: Record<string, any>, prepend = true) =>
      addItemToQueryCache(queryKey, item, prepend, client),

    invalidate: (queryKey: readonly any[] | any[]) =>
      client.invalidateQueries({ queryKey: queryKey as any }),
  };
};

export default useUpdateQueryCache;
