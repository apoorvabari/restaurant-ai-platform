import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { keycloak, initialized } = useKeycloak();
  const { isAuthenticated, roles } = useSelector((state) => state.auth);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!keycloak.authenticated || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !roles?.includes(`ROLE_${requiredRole}`)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
