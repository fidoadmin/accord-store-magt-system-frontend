import { getCookie } from "cookies-next";
import { useBranchDetails } from "@/app/hooks/branch/useBranchDetail";
import React, { useState } from "react";
import { useAgentDetails } from "@/app/hooks/agent/useAgentDetail";
import AgentsMaintenanceEdit from "./AgentsMaintenanceEdit";
import { EditRounded, DeleteRounded } from "@mui/icons-material";
import { DeleteCategoryDetailInterface } from "@/types/CategoryInterface";
import { useDeleteAgentDetail } from "@/app/hooks/agent/useAgentDelete";
import { toast } from "react-toastify";
// Assuming you have an edit component

const AgentsMaintenanceDetail = ({
  id,
  clearSelected,
}: {
  id: string;
  clearSelected: () => void;
}) => {
  const authKey = getCookie("authKey") as string;
  const deleteMutation = useDeleteAgentDetail();
  const [agentEditData, setAgentEditData] = useState<boolean>(false);
  const {
    data: agentDetail,
    error,
    isLoading,
  } = useAgentDetails(authKey || "", id || "");

  if (isLoading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>Error loading Agent details.</div>; // Show error state
  const handleDelete = async () => {
    try {
      // Create an object that matches the expected type
      const deletePayload: DeleteCategoryDetailInterface = {
        Id: agentDetail?.Id as string,
        AuthKey: "",
      };

      await deleteMutation.mutateAsync(deletePayload);
      toast.success(
        `Successfully deleted ${agentDetail?.Name} (ID: ${agentDetail?.Id})`
      );
      clearSelected();
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="h-full w-full p-4 flex flex-col gap-4">
      {!agentEditData ? (
        <>
          <div className="details text-center flex-1 flex flex-col gap-2">
            <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
              <p className="label w-full"> Name:</p>
              <h2 className="w-full text-left font-bold">
                {agentDetail?.Name}
              </h2>
            </div>
            <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
              <div className="w-full space-y-1">
                <p className="label w-full">Address:</p>
                <p className="label w-full text-sm">Email Address:</p>
              </div>
              <div className="w-full space-y-1">
                <h1 className="w-full text-left font-bold">
                  {agentDetail?.Address}
                </h1>
                <h1 className="w-full text-left text-sm">
                  {agentDetail?.Emailaddress}
                </h1>
              </div>
            </div>
            <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
              <p className="label w-full">Phone Number:</p>
              <h3 className="w-full text-left font-bold">
                {agentDetail?.Phonenumber}
              </h3>
            </div>
          </div>
          <div className="btnDiv flex justify-around">
            <button
              className="bg-success px-4 py-2 rounded-xl text-white hover:opacity-80 w-40 flex justify-center items-center gap-4"
              onClick={() => {
                setAgentEditData(true);
              }}
            >
              <EditRounded />
              Edit
            </button>
            <button
              className="bg-error px-4 py-2 rounded-xl text-white hover:opacity-80 w-40 flex justify-center items-center gap-4"
              onClick={handleDelete}
            >
              <span>
                <DeleteRounded />
              </span>
              Delete
            </button>
          </div>
        </>
      ) : (
        <AgentsMaintenanceEdit
          Name={agentDetail!}
          onSave={() => setAgentEditData(false)}
        />
      )}
    </div>
  );
};

export default AgentsMaintenanceDetail;
