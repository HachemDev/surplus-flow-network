
import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './authentication';
import notificationReducer from './notification';

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
