import { useState, useEffect } from 'react';
import { Input } from '@chakra-ui/react'
import { getData } from '../../helperFunctions';

const SearchBar = ({ tableName, setData }:{ tableName: string, setData: (data: Array<File>) => void }) => {
	const [searchInput, setSearchInput] = useState<string>("");

	useEffect(() => {
		if (searchInput === "") return;
		const timeout = setTimeout(async () => {
			console.log("bounc");
			const data = await getData(tableName, searchInput);
			setData(data.users);
		}, 2800)
		return () => clearTimeout(timeout);
	}, [searchInput])

  return (
		<Input placeholder="Search" 
			onChange={(e) => {
				setSearchInput(e.target.value);
			}}
			borderColor="grey.500"
			width="80%"
		/>
  )
}

export default SearchBar