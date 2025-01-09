import {
  AddOrUpdateInventoryDescriptionPayloadInterface,
  AddOrUpdateInventoryDescriptionResponseInterface,
} from "@/types/InventoryInterface";
import { error } from "console";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateInventoryDescription = async (
  InventoryData: AddOrUpdateInventoryDescriptionPayloadInterface
): Promise<AddOrUpdateInventoryDescriptionResponseInterface> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/inventorydescriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(InventoryData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.error}`);
  }

  return response.json();
};
