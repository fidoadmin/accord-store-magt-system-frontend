import {
  AddOrCompanyResponseInterface,
  AddOrUpdateCompanyPayloadInterface,
} from "@/types/CompanyInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateCompany = async (
  CompanyData: AddOrUpdateCompanyPayloadInterface
): Promise<AddOrCompanyResponseInterface> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(CompanyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.error}`);
  }

  return response.json();
};
