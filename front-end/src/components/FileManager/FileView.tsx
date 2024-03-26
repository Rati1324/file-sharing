import React, { useEffect, useState } from 'react';
import { Text, HStack, Tr, Td, Center } from '@chakra-ui/react';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Checkbox } from '@chakra-ui/react'
import FileOperations from './FileOperations';
import { useDispatch } from 'react-redux';
import { addFile, removeFile } from '../../redux/fileManagerSlice';

type FileProps = {
	fileData: {
		id: number;
		name: string;
		size: string;
		owner: string;
	}
	refreshData: () => void,
};

const FileView = ({ fileData, refreshData }: FileProps) => {
  const dispatch = useDispatch();

  const [isChecked, setIsChecked] = useState<boolean>(false);

	function selectFileHandler(checked: boolean) {
    if (checked == true) {
      dispatch(addFile(fileData.id));
    }
    else {
      dispatch(removeFile(fileData.id));
    }
    setIsChecked(checked);
	}

	return (
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
        <Text>
          {fileData.owner}
        </Text>
			</Td>
			<Td>
        <FileOperations selectedFiles={[fileData.id]} refreshData={refreshData} fileName={fileData.name} />
			</Td>
			
			<Td>
        <Center>
          <Checkbox 
            borderColor="blue.700" 
            isChecked={isChecked} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectFileHandler(e.target.checked)} 
          />
        </Center>
			</Td>
      
		</Tr>
	)
}

export default FileView;