import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";  
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyAccount from "./components/auth/VerifyAccount";
import MainPage from "./components/auth/MainPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import HomePage from "./HomePage";
import Chatbot from "../src/components/chatbot/Chatbox.tsx"; //✅ Import Chatbot
import { ChatProvider } from "./components/chatbot/ChatContext.tsx";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const token = localStorage.getItem("access_token");

  return (
    <Router>
      <ChatProvider>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Login/Register */}
        <Route
          path="/login"
          element={token ? <Navigate to="/mainpage" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/mainpage" replace /> : <Register />}
        />

        {/* Email Verification route */}
        <Route path="/verify-account" element={<VerifyAccount />} />


        {/* Password Reset routes */}
        {/* {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected User Page */}
        <Route
          path="/mainpage"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* ✅ Global Chatbot (visible only if logged in) */}
        {token && <Chatbot />}
      </ChatProvider>
    </Router>
  );
}

export default App;
