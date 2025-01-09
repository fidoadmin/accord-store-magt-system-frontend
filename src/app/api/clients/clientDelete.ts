import { DeleteClientInterface } from "@/types/ClientInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteClient = async (
  data: DeleteClientInterface
): Promise<void> => {
  const response = await fetch(`${baseURL}/clients/${data.Id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      AuthKey: data.AuthKey || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete client");
  }
};
