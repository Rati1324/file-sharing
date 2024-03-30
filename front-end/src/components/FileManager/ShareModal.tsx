import {
  Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalFooter, ModalBody, 
  ModalCloseButton, Button, useDisclosure,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import SearchBar from './SearchBar';
import { useSelector } from 'react-redux';
import Table from '../Table';
import UserView from './UserView';

export type User = {
  id: number,
  email: string,
  username: string,
}

const ShareModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [users, setUsers] = useState<User[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const columnNames = ["Email", "Username"];
  const store = useSelector((state: any) => state.fileManager);

  useEffect(() => {
    console.log(users)
  })

  useEffect(() => {
    // console.log(users)
    // if (users !== undefined) {
    setRows(users && users.map((user: User) => {
      return (
        {"component": <UserView data={user} />, "id": user.id}
      )
    }))
  }, [users])

  async function shareFiles() {
    const data = {"user_ids": store.selectedUsers, "file_ids": store.selectedFiles};
    // fetch to share_files endpoint
    const res = await fetch('http://localhost:8000/share_files', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`
      }
    })
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
            <Table columnNames={columnNames} rows={rows} />
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