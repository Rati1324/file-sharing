import { 
  Table, TableContainer,
  Tbody, Th, Thead, Tr,
} from '@chakra-ui/react'
import { User } from './ShareModal';
import UserView from './UserView';

const UsersTable = ({ users }: { users: User[]}) => {

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
            <UserView key={user.id} data={user} />
          ))}
        </Tbody>
    </Table>
  </TableContainer>
  )
}

export default UsersTable;