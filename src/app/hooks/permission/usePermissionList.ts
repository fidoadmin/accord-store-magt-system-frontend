import { useQuery } from "@tanstack/react-query";
import { fetchPermission } from "@/app/api/permission/permissionGet";

export const useFetchPermission = () => {
  const permissionQuery = useQuery({
    queryKey: ["permission"],
    queryFn: () => fetchPermission(),
  });
  return permissionQuery;
};
