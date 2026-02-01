import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";


// fetch user data from the API
const fetchBespoke = async () => {
  const response = await axiosInstance.get("/api/logged-in-bespoke");
  return response.data.user;
}

export const useBespoke = () => {
    const {
        data: bespoke, 
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['bespoke-creator'],
        queryFn: fetchBespoke, 
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1, // Retry once on failure
    });

    return {bespoke, isLoading, isError, refetch};
}

export default useBespoke; 