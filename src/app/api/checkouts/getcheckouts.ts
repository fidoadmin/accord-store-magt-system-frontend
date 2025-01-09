import { CheckoutsResponseInterface } from "@/types/CheckoutInterface";
import { ErrorResponse } from "@/types/ErrorInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCheckouts = async (
  page?: number,
  limit?: number,
  statusid?: string,
  varsearch?: string,
  sortby?: string,
  sortorder?: string,
  isfromreport?: boolean,
  onlycancelled?: boolean,
  onlydispatched?: boolean,
  fromdate?: string,
  todate?: string
): Promise<{ data: CheckoutsResponseInterface[]; totalCount: number }> => {
  const authKey = getCookie("authKey") as string;
  if (!authKey) {
    throw new Error("No authKey found");
  }

  const query = new URLSearchParams({
    Page: page?.toString() || "",
    Limit: limit?.toString() || "",
    StatusId: statusid || "",
    Search: varsearch || "",
    SortBy: sortby || "",
    SortOrder: sortorder || "",
    IsFromReport: isfromreport ? "true" : "false",
    OnlyCancelled: onlycancelled ? "true" : "false",
    OnlyDispatched: onlydispatched ? "true" : "false",
    FromDate: fromdate ? fromdate : "",
    ToDate: todate ? todate : "",
  });

  const response = await fetch(`${baseURL}/checkouts?${query.toString()}`, {
    method: "GET",
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

  const totalCount = parseInt(
    response.headers.get("x-page-totalcount") || "0",
    10
  );

  const data = await response.json();

  return { data, totalCount };
};
