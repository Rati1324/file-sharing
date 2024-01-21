import DeleteFile from '../DeleteFile';
import DownloadIcon from '@mui/icons-material/Download';
import { deleteFiles } from '../../helperFunctions';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

const FileOperations = ({ selectedFiles, getData }: { selectedFiles: number[], getData: Function }) => {
  const toast = useToast();
  const navigate = useNavigate();

  async function deleteFilesHandler() {
    try {
      deleteFiles(selectedFiles);
      getData();
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

  return (
    <>
      <DownloadIcon style={{cursor: "pointer"}} />
      <DeleteFile deleteHandler={deleteFilesHandler} />
    </>
  )
}

export default FileOperations