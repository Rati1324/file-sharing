import { useState } from 'react';
import { Text, HStack, Tr, Td, Center } from '@chakra-ui/react';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Checkbox } from '@chakra-ui/react'
import FileOperations from './FileOperations';

type FileProps = {
	fileData: {
		id: number;
		name: string;
		size: string;
		owner: string;
	}
	refreshData: () => void;
	// selectFile: (id: number) => void;
  selectFile: React.Dispatch<React.SetStateAction<number[]>>
};

const FileView = ({ fileData, selectFile, refreshData }: FileProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

	function selectFileHandler() {
    if (!isChecked) {
      setIsChecked(true);
      // selectFile((prevState: number[]) => [...prevState, fileData.id]);
    }
    else {
      setIsChecked(false);
      // selectFile((prevState: number[]) => prevState.filter((id: number) => id !== fileData.id));
    }
	}

	return (
		// <Tr justify="space-between" w="100%">
		<Tr>
      <Td>
        <HStack>
          <FilePresentIcon style={{ fontSize: 60 }} />
          <Text>{fileData.name.length > 34 ? fileData.name.slice(0, 34) + ".." : fileData.name}</Text>
        </HStack>
      </Td>

			<Td>
        <Text fontWeight="bold">{fileData.size}</Text>
      </Td>

			<Td>
        <FileOperations selectedFiles={[fileData.id]} refreshData={refreshData} fileId={fileData.id} fileName={fileData.name} />
			</Td>
			<Td>
        <Text>
          {fileData.owner}
        </Text>

			</Td>
			<Td>
        <Center>
          <Checkbox borderColor="blue.700" checked={isChecked} onChange={selectFileHandler} />
        </Center>
			</Td>
		</Tr>
	)
}

export default FileView;