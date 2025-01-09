import { DeleteAgentDetailInterface } from "@/types/AgentInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteAgentDetails = async (
  data: DeleteAgentDetailInterface
): Promise<void> => {
  const response = await fetch(`${baseURL}/agents/${data.Id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      AuthKey: data.AuthKey || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete agent");
  }
};
