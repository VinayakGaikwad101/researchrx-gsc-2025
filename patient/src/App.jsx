import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ResetPassword from "./components/ResetPassword";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
import Profile from "./components/Profile";
import { useAuthStore } from "./store/useAuthStore";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {
  const { authUser } = useAuthStore();
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verification" element={<VerifyEmail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Login />} />
        <Route
          path="/appointments"
          element={authUser ? <Appointments /> : <Login />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
