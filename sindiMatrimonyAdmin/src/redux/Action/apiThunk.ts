import { createAsyncThunk } from '@reduxjs/toolkit';
import equal from 'fast-deep-equal';
import apiFetch from '../apiService';

export const updateIfChanged = (
  state: any,
  key: string,
  newValue: any,
): void => {
  try {
    if (!state || typeof state !== 'object') return;
    if (!key) return;

    const currentValue = state[key];

    if (
      currentValue === newValue ||
      (typeof currentValue !== 'object' && typeof newValue !== 'object')
    ) {
      return;
    }

    const isSame = equal(currentValue, newValue);

    if (!isSame) {
      state[key] = newValue;
    }
  } catch (error: any) {
    console.log('error', error);
    state[key] = newValue;
  }
};

export const hasValidData = (value: unknown): boolean => {
  try {
    if (value === undefined || value === null) return false;

    if (Array.isArray(value)) {
      return value?.length > 0;
    }

    if (
      typeof value === 'object' &&
      Object?.prototype.toString.call(value) === '[object Object]'
    ) {
      return Object.keys(value as Record<string, unknown>)?.length > 0;
    }

    return false;
  } catch {
    return false;
  }
};

export const createPostThunk = (type: string) =>
  createAsyncThunk(type, async (arg: any = {}) => {
    const { url, params, data, method = 'POST', ...rest } =
      typeof arg === 'string' ? { url: arg } : arg;
    return await apiFetch({
      url,
      method,
      data: data ?? params,
      params: method === 'GET' ? params : undefined,
      ...rest,
    });
  });

export const createApiThunk = (type: string, defaultMethod: string = 'GET') =>
  createAsyncThunk(type, async (arg: any = {}) => {
    const { url, params, data, method = defaultMethod, ...rest } =
      typeof arg === 'string' ? { url: arg } : arg;
    const isGet = (method || 'GET').toUpperCase() === 'GET';
    return await apiFetch({
      url,
      method,
      data: isGet ? undefined : (data ?? params),
      params: isGet ? (params ?? data) : params,
      ...rest,
    });
  });

export const addApiReducer = (
  builder: any,
  thunk: any,
  stateKey: string,
  dataKey: string = 'data',
  errorMessage: string = 'Something went wrong',
) => {
  builder
    .addCase(thunk.pending, (state: any) => {
      if (!state[stateKey] || typeof state[stateKey] !== 'object') {
        state[stateKey] = { [dataKey]: state[stateKey] ?? null, loader: false, error: null };
      }
      const hasData = hasValidData(state?.[stateKey]?.[dataKey]);

      if (!hasData) {
        state[stateKey].loader = true;
      }

      state[stateKey].error = null;
    })
    .addCase(thunk.fulfilled, (state: any, action: any) => {
      if (!state[stateKey] || typeof state[stateKey] !== 'object') {
        state[stateKey] = { [dataKey]: null, loader: false, error: null };
      }
      const payloadData =
        action?.payload?.[dataKey] !== undefined
          ? action.payload[dataKey]
          : action?.payload?.data !== undefined
            ? action.payload.data
            : action?.payload;

      updateIfChanged(
        state[stateKey],
        dataKey,
        payloadData,
      );
      state[stateKey].loader = false;
    })
    .addCase(thunk.rejected, (state: any, action: any) => {
      if (!state[stateKey] || typeof state[stateKey] !== 'object') {
        state[stateKey] = { [dataKey]: null, loader: false, error: null };
      }
      state[stateKey].loader = false;
      state[stateKey].error =
        action.error?.message || errorMessage;
    });
};

export const addApiReducerWithPagination = (
  builder: any,
  thunk: any,
  stateKey: string,
  dataKey: string = 'data',
  errorMessage: string = 'Something went wrong',
) => {
  builder
    .addCase(thunk.pending, (state: any, action: any) => {
      const pageNo =
        action?.meta?.arg?.params?.pageNo ??
        action?.meta?.arg?.params?.page ??
        action?.meta?.arg?.data?.pageNo ??
        action?.meta?.arg?.pageNo ??
        action?.meta?.arg?.page ??
        1;

      if (!state[stateKey] || typeof state[stateKey] !== 'object') {
        state[stateKey] = {
          [dataKey]: { list: [], hasMore: false },
          loader: false,
          paginationLoader: false,
          error: null,
        };
      }

      if (Number(pageNo) <= 1) {
        const hasData = hasValidData(state?.[stateKey]?.[dataKey]);

        if (!hasData) {
          state[stateKey].loader = true;
        }
      } else {
        state[stateKey].paginationLoader = true;
      }

      state[stateKey].error = null;
    })
    .addCase(thunk.fulfilled, (state: any, action: any) => {
      const pageNo =
        action?.meta?.arg?.params?.pageNo ??
        action?.meta?.arg?.params?.page ??
        action?.meta?.arg?.data?.pageNo ??
        action?.meta?.arg?.pageNo ??
        action?.meta?.arg?.page ??
        1;

      if (!state[stateKey] || typeof state[stateKey] !== 'object') {
        state[stateKey] = {
          [dataKey]: { list: [], hasMore: false },
          loader: false,
          paginationLoader: false,
          error: null,
        };
      }

      const payload =
        action?.payload?.[dataKey] !== undefined
          ? action.payload[dataKey]
          : action?.payload?.data !== undefined
            ? action.payload.data
            : action?.payload;

      const isPagination = Number(pageNo) > 1;
      const currentData = state[stateKey]?.[dataKey];
      const oldList = Array.isArray(currentData?.list)
        ? currentData.list
        : Array.isArray(currentData)
          ? currentData
          : [];

      const newList = Array.isArray(payload?.list)
        ? payload.list
        : Array.isArray(payload)
          ? payload
          : [];

      if (isPagination && Array.isArray(newList) && newList.length > 0) {
        const mergedList = [...oldList, ...newList].filter(
          (item, index, self) =>
            index ===
            self.findIndex(i => {
              const iId = i?._id ?? i?.id;
              const itemId = item?._id ?? item?.id;
              return iId && itemId ? iId === itemId : i === item;
            }),
        );

        const updatedPayload =
          payload && typeof payload === 'object' && !Array.isArray(payload)
            ? { ...payload, list: mergedList }
            : mergedList;

        updateIfChanged(state[stateKey], dataKey, updatedPayload);
      } else {
        updateIfChanged(state[stateKey], dataKey, payload);
      }

      state[stateKey].loader = false;
      state[stateKey].paginationLoader = false;
    })
    .addCase(thunk.rejected, (state: any, action: any) => {
      if (!state[stateKey] || typeof state[stateKey] !== 'object') {
        state[stateKey] = {
          [dataKey]: { list: [], hasMore: false },
          loader: false,
          paginationLoader: false,
          error: null,
        };
      }
      state[stateKey].loader = false;
      state[stateKey].paginationLoader = false;
      state[stateKey].error =
        action.error?.message || errorMessage;
    });
};
