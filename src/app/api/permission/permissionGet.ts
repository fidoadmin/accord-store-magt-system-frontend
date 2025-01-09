import { getCookie } from "cookies-next";
import { PermissionItem } from "@/types/Permission";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchPermission = async (): Promise<PermissionItem[]> => {
  const authKey = getCookie("authKey");
  if (!authKey || typeof authKey !== "string") {
    throw new Error("No valid authKey found");
  }
  //   const response = await fetch(`${baseURL}/permission`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       AuthKey: authKey,
  //     },
  //   });

  //   console.log("Response:", response);
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch permission list");
  //   }

  const permissionsData: PermissionItem[] = [
    {
      sn: 1,
      url: "/login",
      roles: [
        {
          userole: "systemadmin",
          create: true,
          read: true,
          update: false,
          delete: false,
        },
        {
          userole: "companyadmin",
          create: true,
          read: true,
          update: false,
          delete: false,
        },
        {
          userole: "storekeeperchecker",
          create: true,
          read: true,
          update: false,
          delete: false,
        },
        {
          userole: "storekeepermaker",
          create: true,
          read: true,
          update: true,
          delete: false,
        },
      ],
    },
  ];

  return permissionsData;
};
