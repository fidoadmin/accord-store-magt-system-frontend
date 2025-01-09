import { DeleteUserInterface } from "@/types/UserInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteUsers = async (data: DeleteUserInterface): Promise<void> => {
  const response = await fetch(`${baseURL}/users/${data.Id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      AuthKey: data.AuthKey || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};
