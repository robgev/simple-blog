import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get session with query
  //const session = supabase.auth.session(); // Check the current session
  const session = null;

  if (!session) {
    // Redirect to login if there is no active session
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;
