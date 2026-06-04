import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !user?.roles?.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;