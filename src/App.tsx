import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
