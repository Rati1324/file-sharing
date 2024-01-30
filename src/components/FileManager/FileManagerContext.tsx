import React from 'react';

type SelectedFilesContextType = {
  selectedFiles: number[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<number[]>>;
};

export const SelectedFilesContext = React.createContext<SelectedFilesContextType | undefined>(undefined);