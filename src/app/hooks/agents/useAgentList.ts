import { useQuery } from "@tanstack/react-query";
import { fetchAgentList } from "../../api/agents/agentList";

export const useAgentList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    AgentId?: string;
    varcategoryname?: string;
    varsearch?: string;
    varsortby?: string;
    varsortorder?: string;
  }
) => {
  const agentQuery = useQuery({
    queryKey: ["agents", params],
    queryFn: () =>
      fetchAgentList(
        params.page,
        params.limit,
        params.varsearch,
        params.varsortby,
        params.varsortorder
      ),
    enabled: !!authKey,
  });

  return agentQuery;
};
