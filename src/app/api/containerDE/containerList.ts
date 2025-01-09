// import { getCookie } from "cookies-next";

// import { ContainerMaintenanceDetailInterface } from "@/types/ContainerInterface";

// const baseURL = process.env.NEXT_PUBLIC_API_URL;

// export const fetchContainerDetail = async (
//   page?: number,
//   limit?: number,
//   containerId?: string,
//   search?: string
// ): Promise<{
//   data: ContainerMaintenanceDetailInterface[];
//   totalCount: number;
// }> => {
//   const authKey = getCookie("authKey") as string;
//   if (!authKey) {
//     throw new Error("No authKey found");
//   }

//   const query = new URLSearchParams({
//     Page: page?.toString() || "",
//     Limit: limit?.toString() || "",
//     Search: search || "",
//     ContainerId: containerId || "",
//   });

//   const response = await fetch(`${baseURL}/containers?${query.toString()}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       AuthKey: authKey,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch container list");
//   }

//   const totalCount = parseInt(
//     response.headers.get("x-page-totalcount") || "0",
//     10
//   ); // Default to 0 if header not found
//   const data = await response.json();

//   return { data, totalCount };
// };
