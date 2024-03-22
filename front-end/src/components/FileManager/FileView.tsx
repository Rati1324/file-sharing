import React, { useEffect, useState, memo } from 'react';
import { Text, HStack, Tr, Td, Center } from '@chakra-ui/react';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Checkbox } from '@chakra-ui/react'
import FileOperations from './FileOperations';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedFiles } from '../../redux/FileManagerSlice';

type FileProps = {
	fileData: {
		id: number;
		name: string;
		size: string;
		owner: string;
	}
	refreshData: () => void,
};

const FileView = memo(({ fileData, refreshData }: FileProps) => {
  const dispatch = useDispatch();
  const selectedFilesStore = useSelector(setSelectedFiles);
  const [isChecked, setIsChecked] = useState<boolean>(false);

	function selectFileHandler(checked: boolean) {
    if (checked == true) {
      console.log(checked)
      setIsChecked(true);
      // setSelectedFiles([]);
    }
    else {
      console.log(checked)
      setIsChecked(false);
      // setSelectedFiles((prevState: number[]) => prevState.filter((id: number) => id !== fileData.id));
    }
	}

  useEffect(() => {
    // setIsChecked(selectedFiles.includes(fileData.id));
    // console.log(isChecked);
    console.log("render")
  })

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
          <Checkbox 
            borderColor="blue.700" 
            isChecked={isChecked} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectFileHandler(e.target.checked)} 
          />
        </Center>
			</Td>
		</Tr>
	)
})

export default FileView;