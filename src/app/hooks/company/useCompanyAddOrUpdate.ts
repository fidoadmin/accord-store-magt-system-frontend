import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateCompany } from "@/app/api/companiesDE/companyAddOrUpdate";

export const useAddOrUpdateCompaniesMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrUpdateCompany,
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["companies"],
        });
      }
    },
  });
};
