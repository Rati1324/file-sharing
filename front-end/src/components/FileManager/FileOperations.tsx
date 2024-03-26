import DeleteFile from '../DeleteFile';
import DownloadIcon from '@mui/icons-material/Download';
import { deleteFiles } from '../../helperFunctions';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import ShareModal from './ShareModal';
import { useDispatch } from 'react-redux';

type FileOperationsProps = {
  selectedFiles: number[],
  refreshData: Function,
  fileName: string,
}

const FileOperations = ({ selectedFiles, fileName, refreshData }: FileOperationsProps ) => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function deleteFilesHandler() {
    try {
      deleteFiles(selectedFiles);
      refreshData();
      toast({
        title: 'Deleted successfully', status: 'success',
        duration: 2000, isClosable: true,
      })
    }
    catch(error: any) {
      if (error.response && error.response.status === 401) {
        navigate("/signin")
        toast({
          title: 'Unauthorized request.', status: 'error',
          duration: 2000, isClosable: true,
        })
      } else {
        toast({
          title: 'Unknown error has occured', status: 'error',
          duration: 2000, isClosable: true,
        })
      }
    }
  }

  async function downloadFile() {
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
      a.setAttribute('download', fileName);
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

  return (
    <>
      <DownloadIcon onClick={downloadFile} style={{cursor: "pointer"}} />
      <DeleteFile deleteHandler={deleteFilesHandler} />
      <ShareModal />
    </>
  )
}

export default FileOperations