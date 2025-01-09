import { deleteAgentDetails } from "@/app/api/agentDE/agentDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteAgentDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAgentDetails,
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
