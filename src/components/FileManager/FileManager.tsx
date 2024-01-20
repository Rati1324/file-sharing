import { Text, Button, Stack, HStack } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, ChangeEvent } from 'react';
import { uploadFile, verifyToken, getFiles, deleteFiles } from "../../helperFunctions";
import { useToast } from '@chakra-ui/react';
import FileView from './FileView';
import SearchBar from './SearchBar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AlertDialogComponent from '../AlertDialogComponent';
import DownloadIcon from '@mui/icons-material/Download';

const FileManager = ({ loggedIn, setLoggedIn } : { loggedIn: boolean, setLoggedIn: Function }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const token: string | null = sessionStorage.getItem("access_token");
  const [file, setFile] = useState<File>(new File([], ''));
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);

  function setFileUploadHandler(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  async function uploadFileHandler() {
    try {
      const res = await uploadFile(file);
      if (res && res.status === 200) {
        getData();
        toast({
          title: 'File uploaded successfully', status: 'success',
          duration: 2000, isClosable: true,
        })
      }
      else {
        toast({ 
          title: 'File upload failed', status: 'error',
          duration: 2000, isClosable: true,
        })
      }
    }
    catch(error: any) {
      if (error.response && error.response.status === 401) {
        console.log('This is a 401 error!');
      } else {
        console.log('This is an unexpected error:', error);
      }
    }
  }

  async function getData() {
    const files = await getFiles();
    setFiles(files.result);
  }

  useEffect(() => {
    const token: string | null = sessionStorage.getItem('access_token');
    if (token === null) {
      setLoggedIn(false);
      navigate('/signin');
    }

    async function checkToken() {
      const response = await verifyToken(token);
      if (response && response.status === 200) {
        setLoggedIn(true);
        getData();
      }
      else {
        setLoggedIn(false);
        navigate('/signin');
      }
    }
    checkToken();
  }, [loggedIn])

  async function deleteFilesHandler() {
    try {
      deleteFiles(selectedFiles);
      const newFiles = await getFiles();
      setFiles(newFiles.result);
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
    token != null 
    ?
    <Stack minH="60vh" textAlign="center" mt={6}>
      <Text fontSize="30">File Manager</Text>

      <Stack p={5} width="50%" mx="auto" bg="gray.100" spacing={4}>
        <HStack>
          <ArrowBackIosIcon style={{ fontSize: 40 }} />
          <ArrowForwardIosIcon style={{ fontSize: 40 }} />
        </HStack>

        <HStack>
          <SearchBar setFiles={(data: Array<File>) => setFiles(data)} />
          <DownloadIcon style={{cursor: "pointer"}} />
          <AlertDialogComponent deleteHandler={deleteFilesHandler} />
        </HStack>

        <Stack align="start">
          {files.length ?
            files.map((f) => (
              <FileView fileData={f} key={f.id} 
                setFiles={(data: Array<File>) => setFiles(data)}
                selectFile={() => setSelectedFiles([...selectedFiles, f.id])}
              />
            ))
            :
            <Text fontSize="xl" fontWeight={700}>No files found</Text>
          }
          <Stack mt={20}>
            <input type="file"  onChange={setFileUploadHandler} />
            <Button onClick={uploadFileHandler}>Upload</Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
    :
    null
  )
}

export default FileManager;