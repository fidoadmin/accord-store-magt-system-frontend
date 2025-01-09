import {
  AddOrUpdateContainerPayloadInterface,
  AddOrUpdateContainerResponseInterface,
} from "@/types/ContainerInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

export const addOrUpdateContainer = async (
  containerData: AddOrUpdateContainerPayloadInterface
): Promise<AddOrUpdateContainerResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/containers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
    body: JSON.stringify(containerData),
  });

  if (!response.ok) {
    const errorText = await response.json();
    toast.error(errorText.error);
    throw new Error(
      `Failed to delete container (status: ${response.status}): ${errorText}`
    );
  } else {
    if (containerData.Id) {
      toast.success("Container Edited Successfully");
    } else {
      toast.success("Container Added Successfully");
    }
  }
  return response.json();
};
export type { AddOrUpdateContainerPayloadInterface };
