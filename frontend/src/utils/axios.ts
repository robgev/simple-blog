import axios, { InternalAxiosRequestConfig } from "axios";
import { TokenProvider } from "./tokenProvider";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const fetcher = async (endpoint: string) => {
  const token = TokenProvider.get();
  const { data } = await axiosClient.get(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
