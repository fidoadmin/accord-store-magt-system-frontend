import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchInventoryDescriptionList } from "@/app/api/inventorydescription/inventoryDescriptionList";

export const useInventoryDescriptionList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    varsortby?: string;
    varsortorder?: string;
  }
) => {
  const inventoryQuery = useQuery({
    queryKey: ["inventorydescriptions", params],
    queryFn: () =>
      fetchInventoryDescriptionList(
        params.page,
        params.limit,
        params.search,
        params.varsortby,
        params.varsortorder
      ),
    enabled: !!authKey,
    placeholderData: keepPreviousData,
  });

  return inventoryQuery;
};
