import { Box, Container, Flex, Text, HStack } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function FileManager() {
  const navigate = useNavigate();

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
        </HStack>
      </Container>
    </Box>

      // <Container maxW="60%" h="80vh" mx="auto" bg="gray.200"></Container>
  )
}
