import { Input } from '@chakra-ui/react'
import { useState } from 'react';
import { getFiles } from '../../helperFunctions';

const SearchBar = ({setFiles}:{setFiles: (data: Array<File>) => void}) => {
  const [searchInput, setSearchInput] = useState<string>('');

	async function searchFiles() {
		const files = await getFiles(searchInput);
		setFiles(files.result);
	}

  return (
		<Input placeholder="Search" 
			onChange={(e) => setSearchInput(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					searchFiles();
				}
			}}
			borderColor="grey.500"
			width="80%"
		/>
  )
}

export default SearchBar