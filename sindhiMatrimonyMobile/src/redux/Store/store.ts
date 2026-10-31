import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, Storage } from 'redux-persist';
import { mmkv } from '../../storage/Storage';
import dataReducer from '../slices/dataSlice';

const mmkvStorage: Storage = {
  setItem: (key, value) => {
    mmkv.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = mmkv.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: key => {
    try {
      (mmkv as any).delete?.(key) ?? (mmkv as any).remove?.(key);
    } catch (_) {}
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage: mmkvStorage,
  whitelist: ['data'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({ data: dataReducer }),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
