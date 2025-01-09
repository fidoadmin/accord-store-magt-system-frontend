import { LoginRequest, LoginResponse } from "@/types/AuthInterface";
import { ErrorResponse } from "@/types/ErrorInterface";
import { setCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (Data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${baseURL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3003",
    },
    body: JSON.stringify(Data),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error);
  }

  const responseData = await response.json();

  // Set cookies for auth and user data
  setCookie("authKey", responseData.AuthKey, { path: "/", httpOnly: true });
  setCookie("userId", responseData.UserId, { path: "/" });
  setCookie("firstName", responseData.FirstName, { path: "/" });
  setCookie("lastName", responseData.LastName, { path: "/" });
  setCookie("ClientName", responseData.ClientName, { path: "/" });
  setCookie("EmailAddress", responseData.EmailAddress, { path: "/" });

  return responseData;
};
