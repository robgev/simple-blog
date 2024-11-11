import React from "react";
import { Navigate, Outlet, RouteProps } from "react-router-dom";
import { TokenProvider } from "../utils/tokenProvider";

const ProtectedRoute: React.FC<RouteProps> = () => {
  const token = TokenProvider.get();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
