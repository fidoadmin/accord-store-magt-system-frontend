import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCategoryList } from "@/app/api/categories/categoryList";

export const useCategoryList = (
  authKey: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    varsearch?: string;
    varsortby?: string;
    varsortorder?: string;
  }
) => {
  const categoryQuery = useQuery({
    queryKey: ["categories", params],
    queryFn: () =>
      fetchCategoryList(
        params.page,
        params.limit,
        params.varsearch,
        params.varsortby,
        params.varsortorder
      ),
    enabled: !!authKey,
    placeholderData: keepPreviousData,
  });

  return categoryQuery;
};
