import React from 'react';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
// import ReactDOM from "react-dom";
import SignIn from "./components/SignIn";
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');

if (root) {
  const rootInstance = createRoot(root);
  rootInstance.render(
    <ChakraProvider>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </ChakraProvider>
  );
}
// const root = document.getElementById('root');
// const rootInstance = createRoot(root);
// ReactDOM.render(
//   <ChakraProvider>
//     <React.StrictMode>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </React.StrictMode>
//   </ChakraProvider>,
//   document.getElementById('root')
// );