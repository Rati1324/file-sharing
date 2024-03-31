import {
  Flex, Box, FormControl, FormLabel,
  Input, Checkbox, Stack, Button,
  Heading, Text, useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const SignIn = ({ setLoggedIn }:{setLoggedIn: (value: boolean) => void}) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");

  async function sendData(data: Record<string, string>): Promise<any> {
    try {
      const response = await fetch("http://127.0.0.1:8000/signin", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const responseJson = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}. "Details: ${responseJson.detail}`)
      }
      sessionStorage.setItem("access_token", responseJson["access_token"]);
      setLoggedIn(true);
      navigate("/");
    } catch (error: any) {
      setMessage("Invalid email or password");
      console.error('Error: ', error);
    }
  }

  function loginHandler() {
    const data = {email: emailInput, password: passwordInput};
    sendData(data);
  }

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg="rgba(54, 55, 64, 0.2)">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8} minW={'27vw'}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" 
                borderColor="gray.500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") loginHandler()
                }}
                onChange={(e) => setEmailInput(e.target.value)} 
              />
            </FormControl>

            <FormControl id="password">
              <FormLabel>password</FormLabel>
              <Input type="password" 
                borderColor="gray.500"
                onKeyDown={(e) => {
                  if (e.key === "enter") loginHandler()
                }}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </FormControl>

            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>remember me</Checkbox>
                <Text color={'blue.400'}>forgot password?</Text>
              </Stack> 
              <Text color={'red.400'}>{message}</Text>
              <Button bg={'blue.400'} color={'white'} _hover={{bg: 'blue.500'}} onClick={loginHandler}>
                Sign in
              </Button>

            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default SignIn;