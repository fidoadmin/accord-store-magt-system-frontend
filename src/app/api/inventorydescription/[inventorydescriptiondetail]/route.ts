import { InventoryDescriptionDetailInterface } from "@/types/InventoryInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInventoryDescriptionDetail = async (
  Id: string
): Promise<InventoryDescriptionDetailInterface> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/inventorydescriptions/${Id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch inventory detail");
  }
  return response.json();
};
