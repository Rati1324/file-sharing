import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function FileManager() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center">
      <Text fontSize="30" m={4}>File Manager</Text>
      <Box maxW="60%" mx="auto" bg="gray.200">
        <Flex align="center" mb={4}>
          <ArrowBackIosIcon style={{ fontSize: 40 }} />
        </Flex>
        <FilePresentIcon style={{ fontSize: 80 }} />
      </Box>
    </Box>
  )
}
