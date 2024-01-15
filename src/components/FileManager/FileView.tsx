import { Text, Stack, HStack } from '@chakra-ui/react';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import AlertDialogComponent from '../AlertDialogComponent';
import DownloadIcon from '@mui/icons-material/Download';
import { getFiles } from "../../helperFunctions";
import { useToast } from '@chakra-ui/react';

type FileProps = {
  fileData: {
    id: number;
    name: string;
  }
  setFiles: Function;
};

const FileView = ({ fileData, setFiles }: FileProps) => {
  const toast = useToast();

  async function downloadFile(fileId: number) {
    const token: string | null = sessionStorage.getItem('access_token');
    try {
      const res = await fetch(`http://localhost:8000/download_file/${fileId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'file.png');
      a.click();
    }

    catch(error: any) {
      if (error.response && error.response.status === 401) {
        console.log('This is a 401 error!');
      } else {
        console.log('This is an unexpected error:', error);
      }
    }
  }

  async function deleteFile(id: number) {
    const token: string | null = sessionStorage.getItem('access_token');
    try {
      const res = await fetch(`http://127.0.01:8000/delete_file/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      if (res.status === 200) {
        const files = await getFiles();
        setFiles(files.result);
        toast({ title: 'Deleted successfully', status: 'success',
          duration: 2000, isClosable: true,
        })
      }
    }
    catch(error: any) {
      if (error.response && error.response.status === 401) {
        toast({ 
          title: 'Unauthorized request.', status: 'error',
          duration: 2000, isClosable: true,
        })
      } 
    }
  }

  return (
    <Stack align="center" justify="center">
      <FilePresentIcon style={{ fontSize: 60 }} />
      <Text w="150px">{fileData.name}</Text>
      <HStack align="center" justify="center">
        <AlertDialogComponent deleteHandler={() => deleteFile(fileData.id)} />
        <DownloadIcon style={{cursor: "pointer"}} onClick={() => downloadFile(fileData.id)} />
      </HStack>
    </Stack>
  )
}

export default FileView;