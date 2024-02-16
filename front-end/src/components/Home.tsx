import { ReactNode } from 'react'
import { Stack, Container, Box, Flex, Heading, SimpleGrid, Text, Button } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom';

const textStyles = {
	color: '#343A40',
	// fontSize: "1.2rem",
	// fontWeight: 500,
}

const Home = ({ userLoggedIn }: { userLoggedIn: boolean }) => {
	
	return (
		<Box bg="#f6f6f6">
			<Container maxW={'5xl'}>
				<Stack display="flex" align="center">
					<Stack flex={4} justify={{ lg: 'center' }} px={90} py={{ base: 2, md: 20, xl: 60 }}>
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
		</Box>
	)
}

const StatsText = ({ children }: { children: ReactNode }) => (
	<Text as={'span'} fontWeight={700} style={{...textStyles}}>
		{children}
	</Text>
)

const stats = [
	{
		title: 'free features',
		content: (
			<>
				<StatsText>up to 2 gbs without account supports most formats</StatsText> 
			</>
		),
	},


]

export default Home