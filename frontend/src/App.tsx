import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import MainPage from "./components/auth/MainPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import HomePage from "./HomePage";
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
      <Routes>
        {/* Redirect / based on login */}
        <Route path="/" element={<HomePage />} />

        {/* Login/Register redirects if already logged in */}
        <Route
          path="/login"
          element={token ? <Navigate to="/mainpage" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/mainpage" replace /> : <Register />}
        />

        {/* Protected route */}
        <Route
          path="/mainpage"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard route */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;