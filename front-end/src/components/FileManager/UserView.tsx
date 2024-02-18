import React, { useContext } from 'react';
import { User } from './ShareModal';
import ShareIcon from '@mui/icons-material/Share';
import { Tr, Td, Checkbox } from '@chakra-ui/react'
import { SelectedUsersContext } from './FileManagerContext';

const rowStyles = {
  fontSize: "1.2rem"
}

const UserView = ({ data }: { data: User }) => {
  const { setSelectedUsers } = useContext(SelectedUsersContext);

  function selectUserHandler(e: React.ChangeEvent<HTMLInputElement>, id: number) {
    e.target.checked ? setSelectedUsers((prevValue) => [...prevValue, id]) : setSelectedUsers((prevValue) => prevValue.filter((userId) => userId !== id));
  }
  
  return (
    <Tr style={rowStyles}>
      <Td>{data.email}</Td>
      <Td>{data.username}</Td>
      <Td><Checkbox onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectUserHandler(e, data.id)} /></Td>
      <Td><ShareIcon></ShareIcon></Td>
    </Tr>
  )
}

export default UserView;