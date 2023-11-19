import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  return (
    <>
      <Navbar loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn setLoggedIn={(value: boolean) => setLoggedIn(value)} />} />
        <Route path="/signup" element={<SignUp setLoggedIn={(value: boolean) => setLoggedIn(value)} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;