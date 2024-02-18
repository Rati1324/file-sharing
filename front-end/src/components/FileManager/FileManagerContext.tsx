import React from 'react';

type SelectedFilesContextType = {
  selectedFiles: number[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<number[]>>;
};

type SelectedUsersContextType = {
  selectedUsers: number[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>;
};


export const SelectedFilesContext = React.createContext<SelectedFilesContextType>({
  selectedFiles: [],  
  setSelectedFiles: () => {}
});

export const SelectedUsersContext = React.createContext<SelectedUsersContextType>({
  selectedUsers: [],  
  setSelectedUsers: () => {}
});