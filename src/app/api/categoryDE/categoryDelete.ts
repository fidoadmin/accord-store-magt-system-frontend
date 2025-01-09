import { DeleteCategoryDetailInterface } from "@/types/CategoryInterface";
import { DeleteInventoryDescriptionInterface } from "@/types/InventoryInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
console.log();

export const deleteCategoryDetails = async (
  data: DeleteCategoryDetailInterface
): Promise<void> => {
  const response = await fetch(`${baseURL}/categories/${data.Id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      AuthKey: data.AuthKey || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
};
