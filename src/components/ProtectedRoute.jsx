import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  // If there is no token in the Redux state, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component (children)
  return children;
};

// This line is MANDATORY to fix the "default export" error:
export default ProtectedRoute;