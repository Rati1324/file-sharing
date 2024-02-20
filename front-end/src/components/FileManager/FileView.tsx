import { Text, HStack, Tr, Td, Center } from '@chakra-ui/react';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Checkbox } from '@chakra-ui/react'
import FileOperations from './FileOperations';

type FileProps = {
	fileData: {
		id: number;
		name: string;
		size: string;
	}
	refreshData: () => void;
	selectFile: (id: number) => void;
};

const FileView = ({ fileData, selectFile, refreshData }: FileProps) => {
	function selectFileHandler(e: React.ChangeEvent<HTMLInputElement>) {
		e.target.checked ? selectFile(fileData.id) : selectFile(-1);
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
        <Center>
          <Checkbox borderColor="blue.700" onChange={selectFileHandler} />
        </Center>
			</Td>
		</Tr>
	)
}

export default FileView;