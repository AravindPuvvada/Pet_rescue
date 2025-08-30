import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import MainPage from "./MainPage";

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
        <Route path="/" element={<Navigate to={token ? "/mainpage" : "/login"} replace />} />

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
      </Routes>
    </Router>
  );
}

export default App;