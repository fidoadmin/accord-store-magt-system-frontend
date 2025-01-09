// hooks/useGetInventories.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyList } from "@/app/api/companiesDE/companyList";

export const useCompanyList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    varcategoryname?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    isinternal?: string;
    issupplier?: string;
    iscustomer?: string;
    ismanufacturer?: string;
  }
) => {
  const companyQuery = useQuery({
    queryKey: ["companies", params],
    queryFn: () =>
      fetchCompanyList(
        params.page,
        params.limit,
        params.varcategoryname,
        params.search,
        params.sortBy,
        params.sortOrder,
        params.isinternal,
        params.issupplier,
        params.iscustomer,
        params.ismanufacturer
      ),
    enabled: !!authKey,
  });

  return companyQuery;
};
