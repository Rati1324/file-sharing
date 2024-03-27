import { useState, useEffect } from 'react';
import { Input } from '@chakra-ui/react'
import { getData } from '../../helperFunctions';
import { User } from './ShareModal';

const SearchBar = ({ tableName, setData, width }:{ tableName: string, setData: (data: Array<File | User>) => void, width: string }) => {
  const [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const data = await getData(tableName, searchInput);
        setData(data);
      }
      catch(error: any) {
        console.log('Error finding user:', error);
      }
    }, 1300)
    return () => clearTimeout(timeout);
  }, [searchInput])

  return (
    <Input placeholder="Search" 
      onChange={(e) => {
        setSearchInput(e.target.value);
      }}
      borderColor="grey.500"
      width={width}
    />
  )
}

export default SearchBar