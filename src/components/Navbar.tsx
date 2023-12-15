import { Box, Flex, Text, Button, Stack, Collapse,
  Icon, Popover, PopoverTrigger, PopoverContent, useColorModeValue,
  useBreakpointValue, useDisclosure, } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";

export default function WithSubnavigation({ loggedIn, setLoggedIn }: { loggedIn: boolean, setLoggedIn: (value: boolean) => void }) {
  const { isOpen, onToggle } = useDisclosure();
  // const [userToken, setUserToken] = useState<string>("");
  const navigate = useNavigate();

  function signOut() {
    sessionStorage.removeItem("access_token");
    setLoggedIn(false);
    navigate("/");
  }

  useEffect(() => {
    let token = sessionStorage.getItem("access_token");
    setLoggedIn(token == null ? false : true);
  }, [loggedIn])
  
  return (
    <Box>
      <Flex
        bg={useColorModeValue('#2e6f7e', '#2e6f7e')} color={useColorModeValue('gray.600', 'white')} minH={'60px'}
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

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          {
            loggedIn ? 
            <>
              <NavLink to="/signout">
                <Button fontSize={'md'} fontWeight={400} variant={'link'} color={'red'} onClick={signOut}>
                  Sign Out
                </Button>
              </NavLink>
              <NavLink to="/file_manager">
                <Button display={{ base: 'none', md: 'inline-flex' }} fontSize={'sm'} 
                    fontWeight={600} color={'white'} bg={'blue.400'} _hover={{ bg: 'pink.300'}}>
                My files
                </Button>
              </NavLink>
            </>
            :
            <>
              <NavLink to="/signin">
                <Button  fontSize={'md'} fontWeight={400} variant={'link'} color={'white'} style={{textAlign: 'center'}}>
                  Sign In
                </Button>
              </NavLink>
              <NavLink to="/signin">
                <Button display={{ base: 'none', md: 'inline-flex' }} fontSize={'sm'} 
                      fontWeight={600} color={'white'} bg={'blue.400'} _hover={{ bg: 'pink.300'}}>
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
              <NavLink
                to={navItem.to ?? '#'}
              >
                <Text color={"white"}>
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