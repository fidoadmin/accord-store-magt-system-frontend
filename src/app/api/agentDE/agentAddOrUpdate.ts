import {
  AddOrUpdateAgentPayloadInterface,
  AddOrUpdateAgentResponseInterface,
} from "@/types/AgentInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateAgent = async (
  agentData: AddOrUpdateAgentPayloadInterface
): Promise<AddOrUpdateAgentResponseInterface> => {
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
    body: JSON.stringify(agentData),
  });

  if (!response.ok) {
    throw new Error("Failed to update agent");
  }

  return response.json();
};
export type { AddOrUpdateAgentPayloadInterface };
