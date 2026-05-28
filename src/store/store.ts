import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

import consentReducer from './slices/consentSlice';
import settingsReducer from './slices/settingsSlice';
import historyReducer from './slices/historySlice';
import recordingReducer from './slices/recordingSlice';
import { baseApi } from '@/api/baseApi';
import authReducer from './slices/authSlice';
import syncReducer from './slices/syncSlice';

const persistConfig = {
  key: 'lively-root',
  storage: AsyncStorage,
  whitelist: ['consent', 'settings', 'history', 'recording', 'auth', 'sync'],
};

const rootReducer = combineReducers({
  consent: consentReducer,
  settings: settingsReducer,
  history: historyReducer,
  recording: recordingReducer,
  auth: authReducer,
  sync: syncReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
