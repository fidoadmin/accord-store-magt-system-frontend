import { AgentInterface } from "@/types/AgentInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAgentList = async (
  page?: number,
  limit?: number,
  varsearch?: string,
  varsortby?: string,
  varsortorder?: string
): Promise<AgentInterface[]> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    Search: varsearch || "",
    SortBy: varsortby || "",
    SortOrder: varsortorder || "",
  });

  const response = await fetch(`${baseURL}/agents?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch agent list");
  }
  return response.json();
};
