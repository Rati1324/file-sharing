import { useEffect, useState, ReactNode, ChangeEvent } from 'react'
import { Stack, Container, Box, Flex, Heading, SimpleGrid, Text, Button } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom';

const Home = ({ userLoggedIn }: { userLoggedIn: boolean }) => {
  
  return (
    <Box bg={'gray.800'} position={'relative'}>
      <Flex
        flex={1} zIndex={0} display={{ base: 'none', lg: 'flex' }}
        backgroundImage="url('/templates/stats-grid-with-image.png')" backgroundSize={'cover'}
        backgroundPosition="center" backgroundRepeat="no-repeat"
        position={'absolute'} width={'50%'}
        insetY={0} right={0}>
        <Flex bgGradient={'linear(to-r, gray.800 10%, transparent)'} w={'full'} h={'full'} />
      </Flex>
      <Container maxW={'7xl'} zIndex={10} position={'relative'}>
        <Stack direction={{ base: 'column', lg: 'row' }}>
          <Stack flex={1} color={'gray.400'} justify={{ lg: 'center' }} py={{ base: 4, md: 20, xl: 60 }}>
            <Stack spacing={3} mb={{ base: 8, md: 20 }}>
              <Text fontFamily={'heading'} fontWeight={700}
                textTransform={'uppercase'} mb={3}
                fontSize={'xl'} color={'gray.500'}>
                {userLoggedIn ? 'you are logged in' : 'you are not logged in'}
              </Text>
              <Heading color={'white'} mb={5} fontSize={{ base: '3xl', md: '5xl' }}>
                file sharing platform
              </Heading>
              <Text fontSize={'xl'} color={'gray.400'}>
                this platform allows you to share files with other user and also
                have a place to store all your files and stuff...
              </Text>
              {userLoggedIn ?
                <Button width="200px" _hover={{backgroundColor: 'gray.400'}}>
                  <NavLink to="/file_manager">
                    <Text fontSize="xl">Go to file manager</Text>
                  </NavLink>
                </Button>
                :
                null
              }
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              {stats.map((stat) => (
                <Box key={stat.title}>
                  <Text fontFamily={'heading'} fontSize={'3xl'} color={'white'} mb={3}>
                    {stat.title}
                  </Text>
                  <Text fontSize={'xl'} color={'gray.400'}>
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
  <Text as={'span'} fontWeight={700} color={'white'}>
    {children}
  </Text>
)

const stats = [
  {
    title: 'free features',
    content: (
      <>
        <StatsText>up to 2 gbs without account</StatsText> supports most formats
      </>
    ),
  },
  {
    title: '24/7',
    content: (
      <>
        <StatsText>Analytics</StatsText> enabled right in your dashboard without history
        limitations
      </>
    ),
  },
  {
    title: '13%',
    content: (
      <>
        <StatsText>Farms</StatsText> in North America has chosen NewLife™ as their
        management solution
      </>
    ),
  },
  {
    title: '250M+',
    content: (
      <>
        <StatsText>Plants</StatsText> currently connected and monitored by the NewLife™
        software
      </>
    ),
  },
]

export default Home