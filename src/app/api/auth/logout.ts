const baseURL = process.env.NEXT_PUBLIC_API_URL;
import { deleteCookie, getCookie } from "cookies-next";

export const logout = async (): Promise<void> => {
  const authKey = getCookie("authKey");

  if (!authKey) {
    throw new Error("No auth key found");
  }

  const response = await fetch(`${baseURL}/logout`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
      origin: " http://localhost:3004",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  deleteCookie("authKey");
};
