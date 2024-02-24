import { Text, Stack, HStack } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { uploadFile, verifyToken, getData } from "../../helperFunctions";
import { useToast } from '@chakra-ui/react';
import { User } from './ShareModal';
import SearchBar from './SearchBar';
import FileOperations from './FileOperations';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { SelectedFilesContext } from './FileManagerContext';
import Table from '../Table';
import FileView from './FileView';

const FileManager = ({ loggedIn, setLoggedIn } : { loggedIn: boolean, setLoggedIn: Function }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const token: string | null = sessionStorage.getItem("access_token");
  const [file, setFile] = useState<File>(new File([], ''));
  const [files, setFiles] = useState<any[]>([]);
  const [rows, setRows] = useState(Array<React.ReactElement>);

  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);

  function setFileUploadHandler(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  async function uploadFileHandler() {
    if (file.size === 0) {
      toast({ 
        title: 'Please select a file', status: 'error',
        duration: 2000, isClosable: true,
      })
      return;
    }
    try {
      const res = await uploadFile(file);
      if (res && res.status === 200) {
        refreshData();
        toast({
          title: 'File uploaded successfully', status: 'success',
          duration: 2000, isClosable: true,
        })
      }
      else {
        navigate('/signin');
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

  async function refreshData() {
    const files = await getData("files");
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
      try {
        if (response && response.status === 200) {
          setLoggedIn(true);
          await refreshData();
          console.log("files", files)
          
        }
        else {
          setLoggedIn(false);
          navigate('/signin');
        }
      }
      catch(error: any) {
        if (error.response && error.response.status === 401) {
          setLoggedIn(false);
          navigate('/signin');
        } else {
          console.log('This is an unexpected error:', error);
        }
      }
    }
    checkToken();
  }, [loggedIn])

  useEffect(() => {
    setRows(
      files.map((r) => (
        <FileView 
          fileData={r}
          // selectFile={(action: number) => {
          //   if (action === -1) setSelectedFiles(selectedFiles.filter((id) => id !== r.id));
          //   else setSelectedFiles((prevState) => [...prevState, r.id])
          // }}
          refreshData={refreshData}
        />       
      ))
    )
  }, [files])
 
  const columnNames: string[] = ["File Size", "Operations", "Owner", "Select"];
  
  return (
    token != null 
    ?
    <SelectedFilesContext.Provider value={{ selectedFiles, setSelectedFiles }}>
      <Stack minH="60vh" textAlign="center" mt={6}>
        <Text fontSize="30">File Manager</Text>

        <Stack p={5} minH="50vh" width="50%" mx="auto" bg="gray.100" spacing={4} borderRadius="10">
          <HStack>
            <ArrowBackIosIcon style={{ fontSize: 40 }} />
            <ArrowForwardIosIcon style={{ fontSize: 40 }} />
          </HStack>

          <HStack>
            <SearchBar tableName={"files"} setData={(data: Array<File | User>) => setFiles(data)} width={"30%"} />
            {/* im not supposed to be passing selectedfiles here because i chose to use useContext */}
            <FileOperations refreshData={refreshData} fileId={0} fileName={""} />
          </HStack>

          <Table columnNames={columnNames} rows={rows} />
          {/* <Table>
            <Thead>
              <Tr>
                <Th>File Name</Th>
                <Th>File Size</Th>
                <Th>Operations</Th>
                <Th>Owner</Th>
                <Th display="flex" justifyContent="center">Select</Th>
              </Tr>
            </Thead>
            {files && files.length ?
              files.map((f) => (
                <FileView fileData={f} key={f.id} 
                  selectFile={(action: number) => {
                    if (action === -1) setSelectedFiles(selectedFiles.filter((id) => id !== f.id));
                    else setSelectedFiles((prevState) => [...prevState, f.id])
                  }}
                  refreshData={refreshData}
                />
              ))
              :
              <Text fontSize="xl" fontWeight={700}>No files found</Text>
            }
            <Stack mt={20}>
              <input type="file"  onChange={setFileUploadHandler} />
              <Button onClick={uploadFileHandler}>Upload</Button>
            </Stack>
          </Table> */}

        </Stack>
      </Stack>
    </SelectedFilesContext.Provider>
    :
    null
  )
}

export default FileManager;