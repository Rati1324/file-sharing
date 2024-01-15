import { Flex } from '@chakra-ui/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
    <Flex align="center" mb={4}>
			<ArrowBackIosIcon style={{ fontSize: 40 }} />
			<ArrowForwardIosIcon style={{ fontSize: 40 }} />
			<Input placeholder="Search" 
				onChange={(e) => setSearchInput(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						searchFiles();
					}
				}}
			/>
    </Flex>
  )
}

export default SearchBar