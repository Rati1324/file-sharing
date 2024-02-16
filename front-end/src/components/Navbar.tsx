import {
	Box, Flex, Text, Button, Stack, Collapse,
	Popover, PopoverTrigger, useColorModeValue,
	useBreakpointValue, useDisclosure,
	textDecoration,
	background,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";

const navLinkStyle = {
	extDecoration: 'none',
	color: '#343A40',
	fontSize: "1.2rem",
	fontWeight: 500,
	display: "flex",
	alignItems: "center",
	variant: 'link',
}
    
const WithSubnavigation = ({ loggedIn, setLoggedIn }: { loggedIn: boolean, setLoggedIn: (value: boolean) => void }) => {
	const { isOpen, onToggle } = useDisclosure();
	const navigate = useNavigate();
  
	function signOut() {
		sessionStorage.removeItem("access_token");
		setLoggedIn(false);
		navigate("/");
	}

	return (
		<Flex display="flex" alignItems="center" justifyContent="center" bg="rgba(249, 249, 249)" borderBottom="1px solid rgba(52, 58, 64, 0.2)">
			<Flex width="50%" color={useColorModeValue('gray.600', 'white')} minH={'60px'} py={{ base: 2 }}
				px={{ base: 4 }} align={'center'} justify="center">

				<Flex flex={{ base: 2 }} >
					<NavLink to="/" >
						<Button bg="none" style={navLinkStyle}>
							Home
						</Button>
					</NavLink>
				</Flex>

				<Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6} align={'center'}>
					{
					loggedIn ?
						<>
						<NavLink to="/file_manager">
							<Button style={{ ...navLinkStyle }} bg='transparent' _hover={{ bg: 'gray.800' }}>
								My files
							</Button>
						</NavLink>

						<Button style={navLinkStyle} onClick={signOut} >
							<Text>Sign Out</Text>
						</Button>
						</>
						:
						<>
						<NavLink to="/signin">
							<Button  style={{ ...navLinkStyle }}>
								Sign In
							</Button>
						</NavLink>

						<NavLink to="/signup">
							<Button display={{ base: 'none', md: 'inline-flex' }} fontSize={'sm'}
								fontWeight={600} color={'white'} bg={'blue.400'} _hover={{ bg: 'pink.300' }} style={{ ...navLinkStyle, textAlign: "center" }}>
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
		</Flex>
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