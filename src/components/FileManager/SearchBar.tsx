import { useState } from 'react';
import { Input } from '@chakra-ui/react'
import { getData } from '../../helperFunctions';

const SearchBar = ({ tableName, setData }:{ tableName: string, setData: (data: Array<File>) => void }) => {
  const [searchInput, setSearchInput] = useState<string>('');

	async function searchData() {
		const data = await getData(tableName, searchInput);
		setData(data.result);
	}

  return (
		<Input placeholder="Search" 
			onChange={(e) => setSearchInput(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					searchData();
				}
			}}
			borderColor="grey.500"
			width="80%"
		/>
  )
}

export default SearchBar