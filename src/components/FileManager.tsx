import { Box, Container, Flex, Text, HStack, Button, IconButton } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, ChangeEvent } from 'react';
import { uploadFile } from "../helperFunctions";
import { Input } from '@chakra-ui/react'

export default function FileManager() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("access_token");

  function fileUploadHandler(e: ChangeEvent<HTMLInputElement>) {
    let file: File;
    if (e.target.files && e.target.files.length > 0) {
      file = e.target.files[0];
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

  useEffect(() => {
    async function getData() {
      const files = await getFiles();
      console.log(files);
    }
    getData();
  })

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
        <HStack>
          <Box>
            <FilePresentIcon style={{ fontSize: 80 }} />
            <Text>File name 1</Text>
          </Box>
          <Box>
            <FilePresentIcon style={{ fontSize: 80 }} />
            <Text>File name 2</Text>
          </Box>
          <Box>
            <FilePresentIcon style={{ fontSize: 80 }} />
            <Text>File name 3</Text>
          </Box>
          <Box>
            <input 
              id="file-upload" 
              type="file" 
              onChange={(e: ChangeEvent<HTMLInputElement>) => {fileUploadHandler(e)}} 
            />
          </Box>
        </HStack>
        
      </Container>
    </Box>
    :
    null
  )
}