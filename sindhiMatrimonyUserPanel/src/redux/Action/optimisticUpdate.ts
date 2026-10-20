import { PayloadAction } from '@reduxjs/toolkit';

export const optimisticReducers = {
  /**
   * Update a specific item in a paginated or regular list by its id/_id
   */
  updateListItem: (
    state: any,
    action: PayloadAction<{
      stateKey: string;
      id: string;
      data: Record<string, any>;
    }>,
  ) => {
    const { stateKey, id, data } = action.payload;
    const target = state?.[stateKey]?.data;
    const list = Array.isArray(target?.list) ? target.list : Array.isArray(target) ? target : null;

    if (!Array.isArray(list)) return;

    const item = list.find((i: any) => (i?._id && i._id === id) || (i?.id && i.id === id));
    if (!item) return;

    Object.assign(item, data);
  },

  /**
   * Remove an item from a list (e.g. after declining interest, blocking, or deleting)
   */
  removeListItem: (
    state: any,
    action: PayloadAction<{
      stateKey: string;
      id: string;
    }>,
  ) => {
    const { stateKey, id } = action.payload;
    const target = state?.[stateKey]?.data;

    if (Array.isArray(target?.list)) {
      target.list = target.list.filter((i: any) => (i?._id !== id) && (i?.id !== id));
      if (typeof target.total === 'number') target.total = Math.max(0, target.total - 1);
    } else if (Array.isArray(target)) {
      state[stateKey].data = target.filter((i: any) => (i?._id !== id) && (i?.id !== id));
    }
  },

  /**
   * Add a new item to a list (e.g. newly created conversation or match)
   */
  addListItem: (
    state: any,
    action: PayloadAction<{
      stateKey: string;
      item: Record<string, any>;
      prepend?: boolean;
    }>,
  ) => {
    const { stateKey, item, prepend = true } = action.payload;
    const target = state?.[stateKey]?.data;

    if (Array.isArray(target?.list)) {
      if (prepend) {
        target.list.unshift(item);
      } else {
        target.list.push(item);
      }
      if (typeof target.total === 'number') target.total += 1;
    } else if (Array.isArray(target)) {
      if (prepend) {
        target.unshift(item);
      } else {
        target.push(item);
      }
    }
  },
};
