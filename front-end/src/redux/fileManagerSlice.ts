import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileManagerState {
  selectedFiles: number[];
  selectedUsers: number[];
}

const initialState: FileManagerState = { selectedFiles: [], selectedUsers: [] };

export const fileManagerSlice = createSlice({
  name: 'fileManager',
  initialState,

  reducers: {
    addFile: (state, action: PayloadAction<number>) => {
      state.selectedFiles.push(action.payload);
    },
    removeFile: (state, action: PayloadAction<number>) => {
      state.selectedFiles = state.selectedFiles.filter((id) => id !== action.payload);
    },
    addUser: (state, action: PayloadAction<number>) => {
      if (!state.selectedUsers.includes(action.payload)) state.selectedUsers.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.selectedUsers = state.selectedUsers.filter((id) => id !== action.payload);
    },
  }}
)

export const { addFile, removeFile, addUser, removeUser } = fileManagerSlice.actions;
export const selectSelectedFiles = (state: { fileManager: FileManagerState }) => state.fileManager.selectedFiles;

export default fileManagerSlice.reducer;