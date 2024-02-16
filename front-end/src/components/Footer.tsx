import { ReactNode } from 'react'

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  )
}

export const Footer = () => {
  return (
    <Box
      borderTop="1px solid rgba(52, 58, 64, 0.2)"
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container as={Stack} maxW={'6xl'} py={10} 
        
      >
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr 1fr' }}
          spacing={8}
          display="flex" alignItems="center" justifyContent="center"
          >
          <Stack spacing={6}>
            <Text fontSize={'sm'}>© 2024 File Sharing. All rights reserved</Text>
          </Stack>
          <Stack align={'flex-start'}>
            <Box as="a" href={'#'}>
              Overview
            </Box>
          </Stack>
          <Stack align={'flex-start'}>
            <Box as="a" href={'#'}>
              About
            </Box>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default Footer;