import {configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import authReducer from './Slices';
import cartReducer from './cartSlice';

// Define persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Apply persistence to reducers
const rootReducer = {
  user: persistReducer(persistConfig, authReducer),
  cart: persistReducer({key: 'cart', storage: AsyncStorage}, cartReducer),
};

// Create Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

// Define RootState and AppDispatch for better TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
