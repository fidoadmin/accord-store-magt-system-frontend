import { useQuery } from "@tanstack/react-query";
import { fetchCheckouts } from "../../api/checkouts/getcheckouts";

export const useCheckouts = (
  params: {
    page?: number;
    limit?: number;
    statusguid?: string;
    varsearch?: string;
    sortby?: string;
    sortorder?: string;
    isfromreport?: boolean;
    onlycancelled?: boolean;    
    onlydispatched?: boolean; 
    fromdate?:string;
    todate?:string;  
  }
) => {
  const checkoutQuery = useQuery({
    queryKey: ["checkouts", params],
    queryFn: () =>
      fetchCheckouts(
        params.page,
        params.limit,
        params.statusguid,
        params.varsearch,
        params.sortby,
        params.sortorder,
        params.isfromreport,
        params.onlycancelled,   
        params.onlydispatched,
        params.fromdate,
        params.todate    
      ),
  });

  return checkoutQuery;
};
