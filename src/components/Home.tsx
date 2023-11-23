import { useEffect, useState, ReactNode, ChangeEvent } from 'react'
import { Stack, Container, Box, Flex, Text, Heading, SimpleGrid, Input } from '@chakra-ui/react'

export default function StatsGridWithImage() {
  const [userToken, setUserToken] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/uploadfile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation: ', error);
    }
  };

  function fileUploadHandler(e: ChangeEvent<HTMLInputElement>) {
    let file: File;
    if (e.target.files && e.target.files.length > 0) {
      file = e.target.files[0];
      uploadFile(file);
    }
  }

  useEffect(() => {
    let token = sessionStorage.getItem("access_token");
    setUserToken(token == null ? "" : token);
  }, [])

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
            <Box mb={{ base: 8, md: 20 }}>
              <Text
                fontFamily={'heading'}
                fontWeight={700}
                textTransform={'uppercase'}
                mb={3}
                fontSize={'xl'}
                color={'gray.500'}>
                {userToken !== "" ? 'you are logged in' : 'you are not logged in'}
              </Text>
              <Heading color={'white'} mb={5} fontSize={{ base: '3xl', md: '5xl' }}>
                file sharing platform
              </Heading>
              <Text fontSize={'xl'} color={'gray.400'}>
                this platform allows you to share files with other user and also
                have a place to store all your files and stuff...
              </Text>
            </Box>
            <Box>
              <p>Upload your file</p>
              <Input type="file" onChange={e => fileUploadHandler(e)}/>
            </Box>

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