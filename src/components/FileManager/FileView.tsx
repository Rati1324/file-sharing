import { useState } from 'react';
import { Text, HStack } from '@chakra-ui/react';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import DownloadIcon from '@mui/icons-material/Download';
import { getFiles, deleteFiles } from "../../helperFunctions";
import { useToast } from '@chakra-ui/react';
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import FileOperations from './FileOperations';
import DeleteFile from '../DeleteFile';

type FileProps = {
	fileData: {
		id: number;
		name: string;
		size: string;
	}
	getData: () => void;
	selectFile: (id: number) => void;
};

const FileView = ({ fileData, selectFile, getData }: FileProps) => {
	const toast = useToast();
	const navigate = useNavigate();
	const [curFileName, setCurFileName] = useState<string>("");

	async function downloadFile() {
		setCurFileName(fileData.name);
		const token: string | null = sessionStorage.getItem('access_token');

		try {
			const res = await fetch(`http://localhost:8000/download_file/${fileData.id}`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${token}`,
				}
			})
			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.setAttribute('download', fileData.name);
			a.click();
		}

		catch (error: any) {
			if (error.response && error.response.status === 401) {
				console.log('This is a 401 error!');
			} else {
				console.log('This is an unexpected error:', error);
			}
		}
	}
	
	function selectFileHandler(e: React.ChangeEvent<HTMLInputElement>) {
		e.target.checked ? selectFile(fileData.id) : null;
	}

	return (
		<HStack align="center" w="100%">
			<FilePresentIcon style={{ fontSize: 60 }} />
			<Text>{fileData.name.length > 34 ? fileData.name.slice(0, 34) + ".." : fileData.name}</Text>
			<Text>{fileData.size}</Text>

			<FileOperations selectedFiles={[fileData.id]} getData={getData} />

			<Checkbox borderColor="blue.700" onChange={selectFileHandler} />
		</HStack>
	)
}

export default FileView;