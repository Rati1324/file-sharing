import { Box, Flex, Text, Button, Stack, Collapse,
   Popover, PopoverTrigger, useColorModeValue,
  useBreakpointValue, useDisclosure,
  textDecoration, } from '@chakra-ui/react';
import { useNavigate, NavLink } from "react-router-dom";

const navLinkStyle = {
  textDecoration: 'none',

  color: 'white',
  fontSize: "1.2rem",
  fontWeight: 600,
  _hover: { color: 'red' },
}

export default function WithSubnavigation({ loggedIn, setLoggedIn }: { loggedIn: boolean, setLoggedIn: (value: boolean) => void }) {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  function signOut() {
    sessionStorage.removeItem("access_token");
    setLoggedIn(false);
    navigate("/");
  }

  return (
    <Box>
      <Flex bg="#587f8c" color={useColorModeValue('gray.600', 'white')} minH={'60px'}
        py={{ base: 2 }} px={{ base: 4 }} align={'center'}>
        {/* <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex> */}
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}>
            Logo
          </Text>
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6} align={'center'}>
          {
            loggedIn ? 
            <>
              <Button fontSize={'1.2rem'} fontWeight={600} variant={'link'} color={'red'} onClick={signOut} style={{textDecoration: 'none'}}>
                Sign Out
              </Button>
              <NavLink to="/file_manager">
                <Button display={{ base: 'none', md: 'inline-flex' }} fontSize={'1.2rem'} 
                    fontWeight={600} color={'white'} bg={'blue.400'} _hover={{ bg: 'gray.800'}}>
                  My files
                </Button>
              </NavLink>
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

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <NavLink to={navItem.to ?? '#'} >
                <Text color={"white"} style={navLinkStyle}>
                  {navItem.label}
                </Text>
              </NavLink>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
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

interface NavItem {
  label: string
  to?: string
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    to: "/"
  },
]