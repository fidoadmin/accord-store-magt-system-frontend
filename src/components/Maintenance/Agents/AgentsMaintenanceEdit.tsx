import { useState, FormEvent, useEffect } from "react";
import { getCookie } from "cookies-next";
import { CancelRounded, SaveRounded } from "@mui/icons-material";
import { useCategoryDetail } from "@/app/hooks/category/useCategoryDetail";
import { useAddOrUpdateAgent } from "@/app/hooks/agent/useAgentAddOrUpdate";
import {
  AgentDetailInterface,
  AddOrUpdateAgentPayloadInterface,
} from "@/types/AgentInterface";
import { useAgentDetails } from "@/app/hooks/agent/useAgentDetail";

const AgentsMaintenanceEdit = ({
  Name,
  onSave,
}: {
  Name: AgentDetailInterface;
  onSave: (status: boolean) => void;
}) => {
  const authKey = getCookie("authKey") as string;
  const { mutateAsync: addOrUpdateCategory } = useAddOrUpdateAgent();
  const { data: AgentDetails } = useAgentDetails(authKey || "", Name?.Id || "");

  const [agentEditData, setAgentEditData] = useState<AgentDetailInterface>({
    Id: Name?.Id || "",
    Name: Name?.Name || "",
    Address: Name?.Address || "",
    Emailaddress: Name?.Emailaddress || "",
    Phonenumber: Name?.Phonenumber || "",
    Created: "",
    Modified: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAgentEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload: AddOrUpdateAgentPayloadInterface = {
      Id: agentEditData.Id,
      Name: agentEditData.Name,

      // Add Created and Modified fields if your API requires them
      // Created: catEditData.Created,
      Modified: "",
      Address: "",
      Emailaddress: "",
      Phonenumber: "",
      //   Companyguid: null,
      Created: "",
      //   EntryPoint: false,
    };

    try {
      await addOrUpdateCategory(payload);
      onSave(true);
    } catch (error) {
      console.error("Operation Failed", error);
      onSave(false);
    }
  };

  return (
    <div className="text-center flex-1 flex flex-col gap-2">
      <div className="bg-background rounded-xl h-full max-h-20 flex gap-2 items-center justify-center p-2">
        <label className="w-full">Agent Name: </label>
        <input
          name="Name"
          onChange={handleChange}
          value={agentEditData.Name}
          className="w-full text-left font-bold py-1 pl-4 rounded-xl inner-border-2 inner-border-primary"
        />
      </div>

      <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
        {/* <div className="label w-full space-y-1"> */}
        <label className="label w-full">Address:</label>
        <input
          // type="checkbox"
          name="Address"
          onChange={handleChange}
          value={agentEditData.Address}
          className="w-full text-left font-bold py-1 pl-4 rounded-xl inner-border-2 inner-border-primary"
        />
        {/* </div> */}
      </div>

      <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
        <label className="label w-full text-sm">Emailaddress:</label>
        <input
          // type="checkbox"
          name="HasModelName"
          onChange={handleChange}
          value={agentEditData.Emailaddress}
          className="w-full text-left font-bold py-1 pl-4 rounded-xl inner-border-2 inner-border-primary"
        />
      </div>

      <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
        <p className="label w-full">Phone Number:</p>
        <input
          type="text"
          name="PartNumber"
          onChange={handleChange}
          value={agentEditData.Phonenumber} // Ensure you handle PartNumber correctly
          className="w-full text-left font-bold text-sm py-1 pl-4 rounded-xl inner-border-2 inner-border-primary"
        />
      </div>

      <div className="flex justify-around">
        <button
          className="bg-success px-4 py-2 rounded-xl text-white hover:opacity-80 w-40 flex justify-center items-center gap-4"
          onClick={handleSubmit}
        >
          <SaveRounded />
          Save
        </button>
        <button
          className="bg-error px-4 py-2 rounded-xl text-white hover:opacity-80 w-40 flex justify-center items-center gap-4"
          onClick={() => onSave(false)}
        >
          <CancelRounded />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AgentsMaintenanceEdit;
