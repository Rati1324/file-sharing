import { configureStore } from '@reduxjs/toolkit';
import FileManagerReducer from './fileManagerSlice';

export const store = configureStore({
  reducer: {
    fileManager: FileManagerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;