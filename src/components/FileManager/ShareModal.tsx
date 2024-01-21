import {
  Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalFooter, ModalBody, 
  ModalCloseButton, Button, useDisclosure,
} from '@chakra-ui/react'
import ShareIcon from '@mui/icons-material/Share';
import SearchBar from './SearchBar';

const ShareModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  function shareFile() {

  }

  return (
    <>
      <ShareIcon onClick={() => {onOpen(), shareFile()}} style={{cursor: "pointer"}} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt={150}>
          <ModalHeader>Share files with users</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            hi
            {/* <SearchBar /> */}
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