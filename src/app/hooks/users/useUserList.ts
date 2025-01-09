import { useQuery } from "@tanstack/react-query";
import { fetchUserList } from "@/app/api/users/userList";

export const useUserList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    varsearch?: string;
    varsortby?: string;
    varsortorder?: string;
  }
) => {
  const userQuery = useQuery({
    queryKey: ["users", params],
    queryFn: () =>
      fetchUserList(
        params.page,
        params.limit,
        params.varsearch,
        params.varsortby,
        params.varsortorder
      ),
    enabled: !!authKey,
  });

  return userQuery;
};
