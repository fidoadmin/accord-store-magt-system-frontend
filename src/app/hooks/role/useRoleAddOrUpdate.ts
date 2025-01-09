import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateRole } from "@/app/api/roles/roleAddOrUpdate";

export const useAddOrUpdateRoleMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateRole,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["roles"],
        });
      }
    },
  });
};
