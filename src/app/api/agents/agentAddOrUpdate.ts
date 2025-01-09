import { CreateUpdateAgentRequestInterface } from "@/types/AgentInterface"; // Update with correct import path
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateAgent = async (
  agent: CreateUpdateAgentRequestInterface
): Promise<void> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(agent),
  });

  if (!response.ok) {
    throw new Error("Operation Failed");
  }
};
