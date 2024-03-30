import DeleteFile from '../DeleteFile';
import DownloadIcon from '@mui/icons-material/Download';
import { deleteFiles, downloadFiles } from '../../helperFunctions';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import ShareModal from './ShareModal';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

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

  async function deleteFilesHandler() {
    try {
      let res: number;
      if (fileId == null) {
        res = await deleteFiles(selectedFiles)
      }
      else {
        res = await deleteFiles([fileId])
      }
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

  async function downloadFilesHandler() {
    try {
      if (fileId == null) {
        await downloadFiles(selectedFiles, fileName);
      }
      else {
        await downloadFiles([fileId], fileName);
      }
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
      <DownloadIcon onClick={downloadFilesHandler} style={{cursor: "pointer"}} />
      <DeleteFile deleteHandler={deleteFilesHandler} />
      <ShareModal />
    </>
  )
}

export default FileOperations