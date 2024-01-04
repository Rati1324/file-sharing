import { Box, Container, Flex, Text, HStack, Button, Stack } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import DownloadIcon from '@mui/icons-material/Download';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect, ChangeEvent } from 'react';
import { uploadFile } from "../helperFunctions";
import { useToast } from '@chakra-ui/react';
import AlertDialogComponent from './AlertDialogComponent';

export default function FileManager() {
  const toast = useToast();
  const navigate = useNavigate();
  const token: string | null = sessionStorage.getItem("access_token");
  const [file, setFile] = useState<File>(new File([], ''));
  // create a state named files and set it to an empty array of objects, array of object not of File types
  const [files, setFiles] = useState<any[]>([]);
  // const [files, setFiles] = useState<File[]>([]);

  function setFileUploadHandler(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  function fileUploadHandler() {
    try {
      uploadFile(file);
    } 
    catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.log('This is a 401 error!');
      } else {
        console.log('This is an unexpected error:', error);
      }
    }
  }

  async function getFiles() {
    const token: string | null = sessionStorage.getItem('access_token');
    const files = await fetch("http://127.0.0.1:8000/get_files", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    const filesJson = await files.json();
    return filesJson;
  }
  
  async function deleteFile(id: Number) {
    const token: string | null = sessionStorage.getItem('access_token');
    const res = await fetch(`http://127.0.01:8000/delete_file/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })

    if (res.status === 200) {
      const files = await getFiles();
      setFiles(files.result);
      toast({
        title: 'Deleted successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    }
    else if (res.status === 401) {
      toast({
        title: 'Unauthorized request.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
    // console.log(jsonRes.status)
  }

  useEffect(() => {
    async function getData() {
      const files = await getFiles();
      setFiles(files.result);
    }
    getData();
  }, [])

  return (
    token != null 
    ?
    <Box textAlign="center" h="68vh">
      <Text fontSize="30" m={4}>File Manager</Text>
      <Container p={5} maxW="60%" h="100%" mx="auto" bg="gray.200">
        <Flex align="center" mb={4}>
          <ArrowBackIosIcon style={{ fontSize: 40 }} />
          <ArrowForwardIosIcon style={{ fontSize: 40 }} />
        </Flex>

        <Flex height="400px" align="start">
          <HStack>
            {files && files.map((f, i) => (
              <Stack key={i} align="center" justify="center">
                <HStack align="center" justify="center">
                  {/* <DeleteIcon style={{ cursor: "pointer" }} onClick={() => deleteFile(f.id)}/> */}
                  <AlertDialogComponent deleteHandler={() => deleteFile(f.id)} />
                  <DownloadIcon />
                </HStack>
                <FilePresentIcon style={{ fontSize: 80 }} />
                <Text w="150px">{f.name}</Text>
              </Stack>
            ))}

            <Stack>
              <input 
                id="file-upload" 
                type="file" 
                onChange={setFileUploadHandler}
              />
              <Button onClick={fileUploadHandler}>Upload</Button>
            </Stack>
          </HStack>
        </Flex>
      </Container>
    </Box>
    :
    null
  )
}