import { Box, Container, Flex, Text, HStack, Button } from '@chakra-ui/react';
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

  function fileUploadHandler(e: ChangeEvent<HTMLInputElement>) {
    let file: File;
    if (e.target.files && e.target.files.length > 0) {
      file = e.target.files[0];
      uploadFile(file);
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem("access_token") == null) {
      navigate("/");
    }
  }, [])

  return (
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
            <Button
              variant="contained"
              leftIcon={<AddIcon />}
            >
              <Input type="file" onChange={(e: ChangeEvent<HTMLInputElement>) => fileUploadHandler(e)} style={{display: 'none'}}/>
            </Button>
          </Box>
        </HStack>
        
      </Container>
    </Box>

      // <Container maxW="60%" h="80vh" mx="auto" bg="gray.200"></Container>
  )
}