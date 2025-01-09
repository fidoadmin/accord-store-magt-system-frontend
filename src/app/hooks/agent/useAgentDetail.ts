import { fetchAgentDetail } from "@/app/api/agentDE/[agentdetail]/route";
import { useQuery } from "@tanstack/react-query";

export const useAgentDetails = (authKey: string, id: string) => {
  const detailsQuery = useQuery({
    queryKey: ["agentDetails", id],
    queryFn: () => fetchAgentDetail(id),
    enabled: !!authKey,
  });

  return detailsQuery;
};
