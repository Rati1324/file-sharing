import { 
    Flex, Box, FormControl, FormLabel, Input, InputGroup, HStack, 
    InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link,
    FormHelperText, FormErrorMessage
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import ReactNode, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const SignUp = ({ setLoggedIn }: {setLoggedIn: (value: boolean) => void}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [inputErrorMessages, setInputErrorMessages] = useState({username: "", email: "", password: ""});
  const navigate = useNavigate();

  async function sendData(data: Record<string, string>): Promise<any> {
    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
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
      setLoggedIn(true)
      navigate("/");
    } catch (error: any) {
      console.error('Error sending data:', error);
    }
  }

  function signUpHandler(): ReactNode {
    console.log((Object.values(inputErrorMessages).filter(val => val !== "")).length)
    const invalid = (Object.values(inputErrorMessages).filter(val => val !== "")).length;

    console.log("errors", inputErrorMessages)
    if (invalid) return;
    const userData: Record<string, string> = {
      username: usernameInput,
      email: emailInput,
      password: passwordInput,
    }
    sendData(userData);
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
    let errorMessage = passwordRegex.test(passwordInput) ? "" 
    : 
    `Password must contain:
    1) At least one lowercase letter
    2) At least one uppercase letter
    3) At least one digit
    4) Minimum length of 8 characters`;

    setPasswordInput(passwordInput);
    setTimeout(() => {
      setInputErrorMessages((prev) => ({...prev, password: errorMessage}));
    }, 2000)
  }

  function usernameInputHandler(usernameInput: string) {
    // console.log(usernameInput)
    let errorMessage = (usernameInput.length > 4) ? ""
    : 
    "Your username must contain at least 4 characters"
    
    setUsernameInput(usernameInput);
    setTimeout(() => {
      setInputErrorMessages((prev) => ({...prev, username: errorMessage}));
    }, 2000)
  }

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg="rgba(54, 55, 64, 0.2)">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>

        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8} minW={'20vw'}> 
          <Stack spacing={4}>
            <FormControl id="firstName" isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" borderColor="gray.500" onChange={(e) => usernameInputHandler(e.target.value)}/>
            </FormControl>

            <FormControl id="email" isInvalid={inputErrorMessages.email !== ""} isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" borderColor="gray.500" onChange={(e) => emailInputHandler(e.target.value)}/>
                  
              <FormErrorMessage>{inputErrorMessages.email}</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isInvalid={inputErrorMessages.password !== ""} isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input 
                  borderColor="gray.500"
                  type={showPassword ? 'text' : 'password'} 
                  onChange={(e) => passwordInputHandler(e.target.value)}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => {setShowPassword((showPassword) => !showPassword)}}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <FormHelperText whiteSpace="pre-wrap">{inputErrorMessages.password}</FormHelperText>
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

export default SignUp;