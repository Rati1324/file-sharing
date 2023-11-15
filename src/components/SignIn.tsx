import {
  Flex, Box, FormControl, FormLabel,
  Input, Checkbox, Stack, Button,
  Heading, Text, useColorModeValue,
} from '@chakra-ui/react'
import { useState, ReactNode } from 'react';

export default function SimpleCard() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  async function sendData(data: Record<string, string>): Promise<any> {
    try {
      const response = await fetch("http://127.0.0.1:8000/signin", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          }
      })
      if (!response.ok) {
        const jsonResponse = await response.json();
        throw new Error(`HTTP error. Status: ${response.status}. "Details: ${jsonResponse.detail}`)
      }
      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error sending data:', error);
    }
  }

  function loginHandler() {
    const data = {email: emailInput, password: passwordInput};
    sendData(data)
      .then(res => console.log(res))
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e) => setEmailInput(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" onChange={(e) => setPasswordInput(e.target.value)}/>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Text color={'blue.400'}>Forgot password?</Text>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={loginHandler}
                >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
