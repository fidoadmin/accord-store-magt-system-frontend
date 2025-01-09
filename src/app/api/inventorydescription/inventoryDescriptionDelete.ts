import { DeleteInventoryDescriptionInterface } from "@/types/InventoryInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteInventoryDescriptions = async (
  data: DeleteInventoryDescriptionInterface
): Promise<void> => {
  const response = await fetch(`${baseURL}/inventorydescriptions/${data.Id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      AuthKey: data.AuthKey || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete inventory");
  }
};
