import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/axios";
import { endpoints } from "../utils/endpoints";

export const useUser = () => {
  // Maybe show toast on error
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => fetcher(endpoints.auth.user),
  });

  return { isLoadingUser: isLoading, user: data };
};
