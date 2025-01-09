import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchInventoryDescriptionForMaintenance } from "@/app/api/inventorydescription/inventoryDescriptionsForMaintenance";
export const useInventoryDescriptionForMaintenance = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    varsortby?: string;
    varsortorder?: string;
    fromDate?: string;
    toDate?: string;
    isFromReport?:boolean;
    outofstock?: boolean;
    instock?: boolean;
  }
) => {
  const inventoryQuery = useQuery({
    queryKey: ["inventoryDescriptionsForMaintenance", params],
    queryFn: () =>
      fetchInventoryDescriptionForMaintenance(
        params.page,
        params.limit,
        params.categoryId,
        params.search,
        params.varsortby,
        params.varsortorder,
        params.fromDate,
        params.toDate,
        params.isFromReport,
        params.outofstock,
        params.instock
      ),
    enabled: !!authKey,
    placeholderData: keepPreviousData,
  });

  return inventoryQuery;
};
