import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileManagerState {
  selectedFiles: number[];
}

const initialState: FileManagerState = { selectedFiles: [] };

export const fileManagerSlice = createSlice({
  name: 'fileManager',
  initialState,

  reducers: {
    setSelectedFiles: (state, action: PayloadAction<number[]>) => {
      state.selectedFiles = action.payload;
    },
  }}
)

export const { setSelectedFiles } = fileManagerSlice.actions;
export const selectSelectedFiles = (state: { fileManager: FileManagerState }) => state.fileManager.selectedFiles;

export default fileManagerSlice.reducer;