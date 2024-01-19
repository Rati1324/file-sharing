import { AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
  AlertDialogCloseButton, Button, useDisclosure
} from '@chakra-ui/react';
import DeleteIcon from '@mui/icons-material/Delete';

import React from 'react';  

export default function AlertDialogComponenet({ deleteHandler } : {deleteHandler: () => void}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
	const cancelRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <DeleteIcon style={{ cursor: "pointer" }} onClick={onOpen} />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete item
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={() => {deleteHandler(); onClose()}} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
