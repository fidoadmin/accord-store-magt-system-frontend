import { getCookie } from "cookies-next";
import { BranchDetailInterface } from "@/types/BranchInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchBranchDetail = async (
  page?: number,
  limit?: number,
  categoryId?: string,
  branchId?: string,
  companyId?: string,
  search?: string,
  varsortby?: string,
  varsortorder?: string,
  isCheckout?: boolean,
  isFromDispatch?: boolean
): Promise<{ data: BranchDetailInterface[]; totalCount: number }> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    Search: search || "",
    SortBy: varsortby || "",
    SortOrder: varsortorder || "",
    CategoryId: categoryId || "",
    CompanyId: companyId || "",
    BranchId: branchId || "",
    IsCheckout: isCheckout?.toString() || "",
    IsFromDispatch: isFromDispatch?.toString() || "",
  });

  const response = await fetch(`${baseURL}/branches?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch branch list");
  }

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  ); // Default to 0 if header not found
  const data = await response.json();

  return { data, totalCount };
};
