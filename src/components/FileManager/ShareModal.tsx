import { useContext } from 'react';
import {
  Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalFooter, ModalBody, 
  ModalCloseButton, Button, useDisclosure,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import SearchBar from './SearchBar';
import UsersTable from './UsersTable';
import { SelectedFilesContext } from './FileManagerContext';

export type User = {
  id: number,
  email: string,
  username: string,
}

const ShareModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [users, setUsers] = useState<User[]>([]);
  const { selectedFiles } = useContext(SelectedFilesContext);
 
  function shareFile() {
    return;
  }

  useEffect(() => {
    console.log(selectedFiles)
  }, [])

  return (
    <>
      <ShareIcon onClick={() => {onOpen(), shareFile()}} style={{cursor: "pointer"}} />
      <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent mt={150} maxW="30%" minH="30%">
          <ModalHeader>Share files with users</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SearchBar tableName={"users"} setData={(data) => setUsers(data)} width={"90%"} />
            <UsersTable users={users} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ShareModal