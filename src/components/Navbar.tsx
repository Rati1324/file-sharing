import { Box, Flex, Text, Button, Stack, Collapse,
   Popover, PopoverTrigger, useColorModeValue,
  useBreakpointValue, useDisclosure,
  textDecoration,
  background, } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";

const navLinkStyle = {
  textDecoration: 'none',
  color: 'white',
  fontSize: "1.2rem",
  fontWeight: 600,
  _hover: { color: 'red' },
}

const navLinkStyle2 = {
  textDecoration: 'none',
  color: 'white',
  fontSize: "1.2rem",
  fontWeight: 600,
  // _hover: { color: 'red' },
}

const WithSubnavigation = ({ loggedIn, setLoggedIn }: { loggedIn: boolean, setLoggedIn: (value: boolean) => void }) => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  function signOut() {
    sessionStorage.removeItem("access_token");
    setLoggedIn(false);
    navigate("/");
  }

  useEffect(() => {
    console.log(loggedIn);
  }, [loggedIn]) 

  return (
    <Box>
      <Flex bg="#587f8c" color={useColorModeValue('gray.600', 'white')} minH={'60px'} py={{ base: 2 }} 
      px={{ base: 4 }} align={'center'} justify="center">

        <Flex flex={{ base: 2 }} >
          <NavLink to="/" style={{...navLinkStyle2}}>  
              Home
          </NavLink>
        </Flex>

        <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6} align={'center'}>
          {
            loggedIn ? 
            <>
              <NavLink to="/file_manager">
                <Button style={{...navLinkStyle2}} bg='transparent' _hover={{ bg: 'gray.800'}}>
                  My files
                </Button>
              </NavLink>
              <Button style={{...navLinkStyle2}} onClick={signOut}  bg={'blue.400'} _hover={{ bg: 'red.800'}}>
                Sign Out
              </Button>
            </>
            :
            <>
              <NavLink to="/signin">
                <Button fontSize={'md'} fontWeight={400} variant={'link'} color={'white'} style={{...navLinkStyle }}>
                  Sign In
                </Button>
              </NavLink>
              <NavLink to="/signin">
                <Button display={{ base: 'none', md: 'inline-flex' }} fontSize={'sm'} 
                      fontWeight={600} color={'white'} bg={'blue.400'} _hover={{ bg: 'pink.300'}} style={{...navLinkStyle, textAlign: "center"}}>
                  Sign Up
                </Button>
              </NavLink>
            </>
          }
          
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        {/* <MobileNav /> */}
      </Collapse>
    </Box>
  )
}

// const MobileNav = () => {
//   return (
//     <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
//       {NAV_ITEMS.map((navItem) => (
//         <MobileNavItem key={navItem.label} {...navItem} />
//       ))}
//     </Stack>
//   )
// }

// const MobileNavItem = ({ label, to}: NavItem) => {
//   const { isOpen, onToggle } = useDisclosure()

//   return (
//     <Stack spacing={4} onClick={children && onToggle}>
//       <Box
//         py={2}
//         as="a"
//         href={to ?? '#'}
//         justifyContent="space-between"
//         alignItems="center"
//         _hover={{
//           textDecoration: 'none',
//         }}>
//         <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
//           {label}
//         </Text>
//       </Box>
//     </Stack>
//   )
// }

export default WithSubnavigation;