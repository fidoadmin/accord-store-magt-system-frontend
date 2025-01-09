import { DeleteCategoryDetailInterface } from "@/types/CategoryInterface";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

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
    const errorText = await response.json();
    toast.error(errorText.error);
    throw new Error(
      `Failed to delete role(status:${response.status}):${errorText}`
    );
  }
};
