import { DeleteRoleInterface } from "@/types/RolesInterface";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteRole = async (data: DeleteRoleInterface): Promise<void> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/roles/${data.Id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.json();
    toast.error(errorText.error);
    throw new Error(
      `Failed to delete role(status:${response.status}):${errorText}`
    );
  }
};
