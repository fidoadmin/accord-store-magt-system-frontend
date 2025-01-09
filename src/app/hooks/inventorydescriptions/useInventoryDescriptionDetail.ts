import { fetchInventoryDescriptionDetail } from "@/app/api/inventorydescription/[inventorydescriptiondetail]/route";
import { useQuery } from "@tanstack/react-query";

export const useInventoryDescriptionDetails = (authKey: string, id: string) => {
  const detailsQuery = useQuery({
    queryKey: ["inventoryDescDetails", id],
    queryFn: () => fetchInventoryDescriptionDetail(id),
    enabled: !!authKey,
  });

  return detailsQuery;
};
