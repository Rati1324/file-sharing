import {
  Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalFooter, ModalBody, 
  ModalCloseButton, Button, useDisclosure,
  VStack, HStack, Text
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import SearchBar from './SearchBar';

const ShareModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [users, setUsers] = useState<any[]>([]);
  
  function shareFile() {
    return;
  }

  useEffect(() => {
    console.log(users)
  }, [users])

  return (
    <>
      <ShareIcon onClick={() => {onOpen(), shareFile()}} style={{cursor: "pointer"}} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt={150}>
          <ModalHeader>Share files with users</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SearchBar tableName={"users"} setData={(data) => setUsers(data)}/>
            <VStack>
              {users && users.map((user, index) => (
                <HStack key={user.id}>
                  <Text>{user.username}</Text>
                </HStack>
              ))}
            </VStack>
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