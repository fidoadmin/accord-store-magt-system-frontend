import { BranchInterface } from "@/types/BranchInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchBranchList = async (
  page?: number,
  limit?: number,
  varcategoryname?: string,
  companyId?: string,
  varsearch?: string,
  varsortby?: string,
  varsortorder?: string
): Promise<{ data: BranchInterface[]; totalCount: number }> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    Search: varsearch || "",
    SortBy: varsortby || "",
    SortOrder: varsortorder || "",
    CompanyId: companyId || "",
    CategoryName:
      decodeURIComponent(varcategoryname ? varcategoryname : "") || "",
  });

  const response = await fetch(`${baseURL}/branches?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Branch list");
  }
  return response.json();
};
