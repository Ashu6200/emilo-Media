import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { emiloMediaApi } from './apiService';
import { authreducer } from './authFeatures/authSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import persistReducer from 'redux-persist/es/persistReducer';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['authStore'],
};
const reducers = combineReducers({
  [emiloMediaApi.reducerPath]: emiloMediaApi.reducer,
  authStore: authreducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(emiloMediaApi.middleware),
});
setupListeners(store.dispatch);

export const persistor = persistStore(store);
