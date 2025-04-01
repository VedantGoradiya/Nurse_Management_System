import { Routes, Route, Navigate } from "react-router-dom";
import CustomNavbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import Ward from "./pages/Ward";
import UserContext from "./Context/userContext";
import React, { useContext } from "react";

const App = () => {

  const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    const { user } = useContext(UserContext);
    const token = localStorage.getItem("token");

    return user || token ? element : <Navigate to="/login" replace />;
  }

  return (
    <>
      <CustomNavbar />  

      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wards" element={<ProtectedRoute element={<Ward />} />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
