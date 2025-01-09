import { ErrorResponse } from "@/types/ErrorInterface";
import { UserResponse } from "@/types/UserInterface";
import { getCookie, setCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const userDetails = async (UserId: string): Promise<UserResponse> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/users/${UserId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3003",
    },
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error);
  }

  const responseData = await response.json();

  setCookie("authKey", responseData.AuthKey, { path: "/", httpOnly: true });

  return responseData;
};
