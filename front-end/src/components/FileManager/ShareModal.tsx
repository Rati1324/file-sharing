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

export type User = {
  id: number,
  email: string,
  username: string,
}

const ShareModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
 
  async function shareFiles() {
    // const data = {"user_ids": selectedUsers, "files": selectedFiles};
    // // fetch to share_files endpoint
    // const res = await fetch('http://localhost:8000/share_files', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`
    //   }
    // })
    // console.log(res)
  }

  return (
    <>
      <ShareIcon onClick={onOpen} style={{cursor: "pointer"}} />

      <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent mt={150} maxW="30%" minH="30%">
          <ModalHeader>Share files with users</ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <SearchBar tableName={"users"} setData={(data: Array<File | User>) => setUsers(data)} width={"90%"} />
            <UsersTable users={users} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>Cancel</Button>
            <Button variant='ghost' onClick={shareFiles}>Share</Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  )
}

export default ShareModal