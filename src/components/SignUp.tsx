import { 
    Flex, Box, FormControl, FormLabel, Input, InputGroup, HStack, 
    InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link,
    FormHelperText, FormErrorMessage
} from '@chakra-ui/react';
import { useState, ReactNode } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [inputErrorMessages, setInputErrorMessages] = useState({username: "", email: "", password: ""});

  async function sendData(data: Record<string, string>): Promise<any> {
    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
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
      console.log(typeof result)
      return result;
    } catch (error: any) {
      console.error('Error sending data:', error);
    }
  }

  function signUpHandler(): ReactNode {
    const userData: Record<string, string> = {
      username: usernameInput,
      email: emailInput,
      password: passwordInput,
    }

    sendData(userData)
      .then(res => console.log(res))
    return null;
  }

  function emailInputHandler(emailInput: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errorMessage = emailRegex.test(emailInput) ? "" : "Invalid email";

    setEmailInput(emailInput);
    setTimeout(() => {
      setInputErrorMessages((prev) => ({...prev, email: errorMessage}));
    }, 2000)
  }

  function passwordInputHandler(passwordInput: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    let errorMessage = passwordRegex.test(passwordInput) ? "" : "what is this";

    setPasswordInput(passwordInput);
    setTimeout(() => {
      setInputErrorMessages((prev) => ({...prev, password: errorMessage}));
    }, 2000)
  }

  return (
    <Flex minH={'90vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack w={"25%"} spacing={8} mx={'auto'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={10}> 
          <Stack spacing={4}>
            <HStack>
              <FormControl id="firstName" isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" onChange={(e) => setUsernameInput(e.target.value)}/>
              </FormControl>
              </HStack>
              <FormControl id="email" isInvalid={inputErrorMessages.email !== ""} isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" onChange={(e) => emailInputHandler(e.target.value)}/>
                <FormErrorMessage>{inputErrorMessages.email}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                  
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => {setShowPassword((showPassword) => !showPassword)}}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting" size="lg" bg={'blue.400'}
                color={'white'} _hover={{ bg: 'blue.500', }}
                onClick={signUpHandler}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}