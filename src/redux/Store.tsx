import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './Slices'; // ✅ Use `authReducer`, not `authSlice`

// Define persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Apply persistence to auth slice
const persistedReducer = persistReducer(persistConfig, authReducer);

// Create Redux store
export const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

// Define RootState and AppDispatch for better TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
