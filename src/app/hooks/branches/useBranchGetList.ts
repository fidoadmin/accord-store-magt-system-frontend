import { useQuery } from "@tanstack/react-query";
import { fetchBranchList } from "@/app/api/branches/branchList";

export const useBranchGetList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  const branchQuery = useQuery({
    queryKey: ["branches", params],
    queryFn: () =>
      fetchBranchList(
        params.page,
        params.limit,
        params.search,
        params.sortBy,
        params.sortOrder
      ),
    enabled: !!authKey,
  });

  return branchQuery;
};
