import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateClient } from "@/app/api/clients/clientAddOrUpdate";

export const useAddOrUpdateClientMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateClient,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["clients"],
        });
      }
    },
  });
};
