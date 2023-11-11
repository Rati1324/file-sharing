import React from 'react';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from "react-dom";
import SignIn from "./components/SignIn";
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <ChakraProvider>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);