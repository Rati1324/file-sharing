import { useState, useEffect } from 'react';
import { Input } from '@chakra-ui/react'
import { getData } from '../../helperFunctions';

const SearchBar = ({ tableName, setData, width }:{ tableName: string, setData: (data: Array<File>) => void, width: string }) => {
	const [searchInput, setSearchInput] = useState<string>("");

	useEffect(() => {
		if (searchInput === "") return;
		const timeout = setTimeout(async () => {
			const data = await getData(tableName, searchInput);
			setData(data.users);
		}, 2000)
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