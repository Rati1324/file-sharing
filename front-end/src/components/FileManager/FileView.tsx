import React, { useEffect, useState } from 'react';
import { Text, HStack, Tr, Td, Center } from '@chakra-ui/react';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Checkbox } from '@chakra-ui/react'
import FileOperations from './FileOperations';
import { SelectedFilesContext } from './FileManagerContext';

type FileProps = {
	fileData: {
		id: number;
		name: string;
		size: string;
		owner: string;
	}
	refreshData: () => void;
};

const FileView = ({ fileData, refreshData }: FileProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { selectedFiles, setSelectedFiles } = React.useContext(SelectedFilesContext);

	function selectFileHandler(checked: boolean) {
    if (checked) {
      setSelectedFiles((prevState: number[]) => [...prevState, fileData.id]);
    }
    else {
      setSelectedFiles((prevState: number[]) => prevState.filter((id: number) => id !== fileData.id));
    }
	}

  useEffect(() => {
    setIsChecked(selectedFiles.includes(fileData.id));
    console.log("rendered", selectedFiles)
  }, [])

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
          <Checkbox borderColor="blue.700" isChecked={isChecked} onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectFileHandler(e.target.checked)} />
        </Center>
			</Td>
		</Tr>
	)
}

export default FileView;