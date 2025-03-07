import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PeriodicTable from "./components/PeriodicTable.jsx";
import ResetPassword from "./components/ResetPassword";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
import Profile from "./components/Profile";
import MedicalReports from "./components/MedicalReports";
import CreateBlog from "./components/CreateBlog";
import BlogList from "./components/BlogList.jsx";
import BlogDetail from "./components/BlogDetail";
import { useAuthStore } from "./store/useAuthStore";
import ForgotPassword from "./components/ForgotPassword";
import Research from "./components/Research.jsx";
import Chat from "./components/Chat/Chat.jsx";
import UserList from "./components/Chat/UserList.jsx";
import CreateGroup from "./components/Chat/CreateGroup.jsx";
import GroupInfo from "./components/Chat/GroupInfo.jsx";

const App = () => {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verification" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Login />} />
        <Route
          path="/medical-reports"
          element={authUser ? <MedicalReports /> : <Login />}
        />
        <Route
          path="/periodic-table"
          element={authUser ? <PeriodicTable /> : <Login />}
        />
        <Route path="/research" element={authUser ? <Research /> : <Login />} />
        <Route
          path="/create-blog"
          element={authUser ? <CreateBlog /> : <Login />}
        />
        <Route path="/blogs" element={authUser ? <BlogList /> : <Login />} />
        <Route
          path="/blogs/:blogId"
          element={authUser ? <BlogDetail /> : <Login />}
        />
        <Route path="/chat" element={authUser ? <Chat /> : <Login />} />
        <Route path="/chat/new" element={authUser ? <UserList /> : <Login />} />
        <Route path="/chat/group/new" element={authUser ? <CreateGroup /> : <Login />} />
        <Route path="/chat/group/:groupId/info" element={authUser ? <GroupInfo /> : <Login />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
