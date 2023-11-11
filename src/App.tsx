import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {

  return (
    <>
      {/* <Routes>
        <Route path="/signin" element={<SignIn />} />
      </Routes> */}
      <Navbar />
      <Home />
    </>
  );
}

export default App;
