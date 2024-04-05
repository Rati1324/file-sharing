import { useState } from 'react';
import { User } from './ShareModal';
import { Tr, Td, Checkbox } from '@chakra-ui/react'
import { useDispatch } from 'react-redux';
import { addUser, removeUser } from '../../redux/fileManagerSlice';
import { useSelector } from 'react-redux';

const rowStyles = {
  fontSize: "1.2rem"
}

type UserViewProps = {
  data: User,
}

const UserView = ({ data }: UserViewProps) => {
  const [selected, setSelected] = useState<boolean>(false);
  const dispatch = useDispatch();
  const selectedUsers = useSelector((state: any) => state.fileManager.selectedUsers);
  
  function selectUserHandler(checked: boolean, id: number) {
    console.log("hi")
    checked ? 
    dispatch(addUser(id))
    :
    dispatch(removeUser(id))
    setSelected(checked)
  }
 
  return (
    <Tr style={rowStyles}>
      <Td>{data.email}</Td>
      <Td>{data.username}</Td>
      <Td><Checkbox isChecked={selected} onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectUserHandler(e.target.checked, data.id)} /></Td>
    </Tr>
  )
}

export default UserView;