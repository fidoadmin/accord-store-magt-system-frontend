import {
  UserResponseInterface,
  UserUpdateInterface,
} from "@/types/UserInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateUserProfile = async (
  UserData: UserUpdateInterface
): Promise<UserResponseInterface> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(UserData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.error}`);
  }

  return response.json();
};
