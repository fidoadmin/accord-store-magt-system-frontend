import {
  AddOrUpdateClientPayloadInterface,
  AddOrUpdateClientResponseInterface,
} from "@/types/ClientInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateClient = async (
  ClientData: AddOrUpdateClientPayloadInterface
): Promise<AddOrUpdateClientResponseInterface> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(ClientData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.error}`);
  }

  return response.json();
};
