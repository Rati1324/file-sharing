import DeleteFile from '../DeleteFile';
import DownloadIcon from '@mui/icons-material/Download';
import { deleteFiles, downloadFiles } from '../../helperFunctions';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import ShareModal from './ShareModal';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

type FileOperationsProps = {
  fileId: number | null,
  refreshData: Function,
  fileName: string,
}

const FileOperations = ({ fileId, fileName, refreshData }: FileOperationsProps ) => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedFiles = useSelector((state: any) => state.fileManager.selectedFiles);
  const selectedUsers = useSelector((state: any) => state.fileManager.selectedUsers);
  const [filesToSend, setFileToSend] = useState<number[]>([]); 

  useEffect(() => {
    if (fileId == null) {
      setFileToSend(selectedFiles);
    }
    else {
      setFileToSend([fileId]);
    }
  }, [selectedFiles])

  async function shareFilesHandler() {
    const data = {"user_ids": selectedUsers, "file_ids": filesToSend};
    // fetch to share_files endpoint
    const res = await fetch('http://localhost:8000/share_files', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`
      }
    })
    if (res.status === 200) {
      toast({
        title: 'Shared succesfully', status: 'success',
        duration: 2000, isClosable: true,
      })
    }
    else if (res.status === 401) {
      toast({
        title: 'Unauthorized request.', status: 'error',
        duration: 2000, isClosable: true,
      })
    }
    else {
      toast({
        title: 'Failed to share', status: 'error',
        duration: 2000, isClosable: true,
      })
    }
  }

  async function downloadFilesHandler() {
    try {
      await downloadFiles(filesToSend, fileName);
    }

    catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.log('This is a 401 error!');
      } else {
        console.log('This is an unexpected error:', error);
      }
    }
  }

  async function deleteFilesHandler() {
    try {
      let res: number = await deleteFiles(filesToSend);
      refreshData();

      if (res !== 200) {
        toast({
          title: 'Failed to delete', status: 'error',
          duration: 2000, isClosable: true,
        })
      }
      else {
        toast({
          title: 'Deleted successfully', status: 'success',
          duration: 2000, isClosable: true,
        })
      }
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

  return (
    <>
      <DownloadIcon onClick={downloadFilesHandler} style={{cursor: "pointer"}} />
      <DeleteFile deleteFiles={deleteFilesHandler} />
      <ShareModal shareFiles={shareFilesHandler}/>
    </>
  )
}

export default FileOperations