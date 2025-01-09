import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddOrUpdateAgentResponseInterface,
  AddOrUpdateAgentPayloadInterface,
} from "@/types/AgentInterface";
import { addOrUpdateAgent } from "@/app/api/agentDE/agentAddOrUpdate";

export const useAddOrUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AddOrUpdateAgentResponseInterface,
    unknown,
    AddOrUpdateAgentPayloadInterface
  >({
    mutationFn: addOrUpdateAgent,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["agentDetails"],
        });
      }
    },
  });
};
