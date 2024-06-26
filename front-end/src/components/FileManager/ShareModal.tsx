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
import { useToast } from '@chakra-ui/react';

export type User = {
  id: number,
  email: string,
  username: string,
}

const ShareModal = ({ shareFiles }: { shareFiles: Function }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [users, setUsers] = useState<User[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const toast = useToast();
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