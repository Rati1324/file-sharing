import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import FileManager from "./components/FileManager";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyToken } from "./helperFunctions";
import { useNavigate } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  function setLoggedInHandler(value: boolean): void {
    setLoggedIn(value);
  }
  
  useEffect(() => {
    const token: string | null = sessionStorage.getItem('access_token');
    async function checkToken() {
      const response = await verifyToken(token);
      if (response && response.status === 200) {
        setLoggedIn(true);
      }
      else {
        setLoggedIn(false);
        navigate('/signin');
      }
    }
    checkToken();
  }, [])

  return (
    <>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedInHandler} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn setLoggedIn={(value: boolean) => setLoggedIn(value)} />} />
        <Route path="/signup" element={<SignUp setLoggedIn={(value: boolean) => setLoggedIn(value)} />} />
        <Route path="/file_manager" element={<FileManager loggedIn={loggedIn} setLoggedIn={setLoggedInHandler} />}  />
      </Routes>
      <Footer />
    </>
  );
}

export default App;