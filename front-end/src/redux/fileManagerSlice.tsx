import { createSlice } from '@reduxjs/toolkit';

export const fileManagerSlice = createSlice({
  name: 'fileManager',
  initialState: {
    selectedFiles: [] = [],
  },

  reducers: {
      setSelectedFiles: (state: , action) => {
        state.selectedFiles = action.payload;
      },
    },
  }
)