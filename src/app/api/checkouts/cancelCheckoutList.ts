import { getCookie } from "cookies-next";
import { VerifyCheckoutResponseInterface } from "@/types/CheckoutInterface";
import { ErrorResponse } from "@/types/ErrorInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const cancelCheckoutList = async (
  checkoutNumber: string
): Promise<VerifyCheckoutResponseInterface> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/checkout/${checkoutNumber}/cancel`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3003",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error);
  }

  const responseData = await response.json();
  return responseData;
};
