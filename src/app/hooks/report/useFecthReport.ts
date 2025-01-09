// hooks/useGetInventories.ts
import { useQuery } from "@tanstack/react-query";
import { fetchReport } from "@/app/api/report/report";

export const useFetchReport = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    sortBy?:string;
    sortOrder?:string;
    search?: string;
    inventoryDescriptionId?: string;
    buyerId?: string;
    fromDate?: string;
    toDate?: string;
  }
) => {
  const reportQuery = useQuery({
    queryKey: ["report", params],
    queryFn: () =>
      fetchReport(
        params.page,
        params.limit,
        params.sortBy,
        params.sortOrder,
        params.search,
        params.inventoryDescriptionId,
        params.buyerId,
        params.fromDate,
        params.toDate
      ),
  });
  return reportQuery;
};
