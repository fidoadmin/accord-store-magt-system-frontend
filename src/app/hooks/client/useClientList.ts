import { useQuery } from "@tanstack/react-query";
import { fetchClientList } from "@/app/api/clients/clientList";

export const useClientList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  const clientQuery = useQuery({
    queryKey: ["clients", authKey, params],
    queryFn: () =>
      fetchClientList(
        params.page,
        params.limit,
        params.search,
        params.sortBy,
        params.sortOrder
      ),
    enabled: !!authKey,
  });

  return clientQuery;
};
