import { AgentDetailInterface } from "@/types/AgentInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAgentDetail = async (
  Id: string
): Promise<AgentDetailInterface> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/agents/${Id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch agent detail");
  }
  return response.json();
};
