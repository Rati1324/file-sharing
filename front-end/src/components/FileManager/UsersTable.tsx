import { useState } from 'react';
import { 
  Table, TableContainer,
  Tbody, Td, Th, Thead, Tr,
} from '@chakra-ui/react'
import ShareIcon from '@mui/icons-material/Share';
import { User } from './ShareModal';
import { Checkbox } from '@chakra-ui/react'

const rowStyles = {
  fontSize: "1.2rem"
}

const UsersTable = ({ users }: { users: User[]}) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  function selectUserHandler(e: React.ChangeEvent<HTMLInputElement>, id: number) {
    e.target.checked ? setSelectedUsers([...selectedUsers, id]) : setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
  }

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Username</Th>
            <Th style={{width:"10px"}}></Th>
            <Th style={{width:"10px"}}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user: User) => (
            <Tr key={user.id} style={rowStyles}>
              <Td>{user.email}</Td>
              <Td>{user.username}</Td>
              <Td><Checkbox onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectUserHandler(e, user.id)} /></Td>
              <Td><ShareIcon></ShareIcon></Td>
            </Tr>
          ))}
        </Tbody>
    </Table>
  </TableContainer>
  )
}

export default UsersTable;