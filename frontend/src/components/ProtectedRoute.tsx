import React from "react";
import { Navigate, Outlet, RouteProps, useNavigate } from "react-router-dom";
import { TokenProvider } from "../utils/tokenProvider";
import { axiosClient } from "../utils/axios";
import { InternalAxiosRequestConfig } from "axios";

const ProtectedRoute: React.FC<RouteProps> = () => {
  const token = TokenProvider.get();
  const navigate = useNavigate();

  axiosClient.interceptors.request.use(
    (axiosConfig) => {
      const token = TokenProvider.get();

      if (!token) {
        navigate("/login");
        return axiosConfig;
      }

      return {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      } as InternalAxiosRequestConfig;
    },
    (error) => {
      console.log(error);
      Promise.reject(error);
    },
  );

  axiosClient.interceptors.response.use(
    (conf) => conf,
    (error) => {
      if (error.status === 401) {
        navigate("/login");
      }
      return Promise.reject(error);
    },
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
