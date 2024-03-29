import React, { ReactNode, useEffect } from 'react'
import { Stack, Container, Box, Flex, Heading, SimpleGrid, Text, Button, Checkbox as ChakraBox } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom';
import { setSelectedFiles, selectedFiles } from '../redux/fileManagerSlice';

const textStyles = {
	color: '#343A40',
	// fontSize: "1.2rem",
	// fontWeight: 500,
}

const Home = ({ userLoggedIn }: { userLoggedIn: boolean }) => {
  useEffect(() => {
    console.log('hi')
  }, [])

	return (
		<Flex minH={'83vh'} bg="rgba(54, 55, 64, 0.2)">
			<Container maxW={'5xl'}>
				<Stack display="flex" align="center">
					<Stack flex={4} justify={{ lg: 'center' }} px={90} py={{ base: 20, md: 30, xl: 40 }}>
						<Stack spacing={4} mb={{ base: 4, md: 20 }}>
							<Text fontFamily={'heading'} fontWeight={700}
								textTransform={'uppercase'}
								fontSize={'xl'} color={'gray.500'} style={{... textStyles}}>
								{userLoggedIn ? 'Welcome' : 'you are not logged in'}
							</Text>

							<Heading color={'gray.500'} fontSize={{ base: '3xl', md: '5xl' }} style={{... textStyles}}>
								File sharing platform
							</Heading>

							<Text fontSize={'xl'} mb={5} style={{... textStyles}}>
								this platform allows you to share files with other users and also
								have a place to store all your files and stuff...
							</Text>
							{userLoggedIn ?
								<Button width="200px" _hover={{ backgroundColor: 'gray.400' }}>
									<NavLink to="/file_manager" >
										<Text fontSize="xl" style={{...textStyles}}>Go to file manager</Text>
									</NavLink>
								</Button>
								:
								null
							}
						</Stack>

						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
							{stats.map((stat) => (
								<Box key={stat.title}>
									<Text fontFamily={'heading'} fontSize={'3xl'} mb={3} style={{...textStyles}}>
										{stat.title}
									</Text>

									<Text fontSize={'xl'}>
										{stat.content}
									</Text>
								</Box>
							))}
						</SimpleGrid>
					</Stack>
					<Flex flex={1} />
				</Stack>
			</Container> 
		</Flex>
	)
}


const StatsText = ({ children }: { children: ReactNode }) => (
	<Text as={'span'} fontWeight={700} style={{...textStyles}}>
		{children}
	</Text>
)

const stats = [
	{ title: 'free features', content: <StatsText>up to 2 gbs without account supports most formats</StatsText>},
	{ title: 'premium features', content: <StatsText>upload more than 2gbs with any format, allows sharing</StatsText>},
]

export default Home