import { useAddOrUpdateAgent } from "@/app/hooks/agent/useAgentAddOrUpdate";
import { useAddOrUpdateInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionAddOrUpdate";
import { AddOrUpdateAgentPayloadInterface } from "@/types/AgentInterface";
import { AddOrUpdateUserPayloadInterface } from "@/types/UserInterface";
import { SaveRounded, CancelRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";
import { useState, FormEvent } from "react";
import { toast } from "react-toastify";

const AgentsAddOverlay = ({
  onOverlayClose,
}: {
  onOverlayClose: () => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const itemsPerPage = 20;
  const [category, setCategory] = useState<{ name?: string; id?: string }>({});

  const addOrUpdateInventoryDescription = useAddOrUpdateAgent();

  const initialInventoryData = {
    Id: "",
    Name: "",
    Address: "",
    Emailaddress: "",
    Phonenumber: "",
    Created: "",
    Modified: "",
  };

  const [descAddData, setDescAddData] =
    useState<AddOrUpdateAgentPayloadInterface>(initialInventoryData);

  useState(() => {
    const key = getCookie("authKey") as "";
    setAuthKey(key);
  });

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleChange = (e: any) => {
    setDescAddData({ ...descAddData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!descAddData.Name) {
      toast.error("FirstName is required.", { position: "top-right" });
      return;
    }

    if (!descAddData.Emailaddress) {
      toast.error("Emailaddress is required.", { position: "top-right" });
      return;
    }

    toast.success("Users saved successfully!", {
      position: "top-right",
    });
    onOverlayClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20"
      onClick={onOverlayClose}
    >
      <div
        className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-surface border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <div className="titleDiv">
          <h1 className="text-lg text-primary text-center font-bold">
            Add User
          </h1>
        </div>

        <div>
          <p className="text-text text-sm">
            First Name: <span className="text-error">*</span>
          </p>
          <input
            name="FirstName"
            value={descAddData.Name || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">Last Name:</p>
          <input
            name="LastName"
            value={descAddData.Address || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>

        <div>
          <p className="text-text text-sm">
            Email Address:<span className="text-error">*</span>
          </p>
          <input
            name="Emailaddress"
            value={descAddData.Emailaddress || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">Phone Number:</p>
          <input
            name="Phonenumber"
            value={descAddData.Phonenumber || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-4 justify-center mt-5">
          <button
            className="bg-success rounded-xl p-2 w-40 flex items-center justify-center gap-4 text-white"
            onClick={handleSubmit}
          >
            <SaveRounded /> Save
          </button>
          <button
            className="bg-error rounded-xl p-2 w-40 flex items-center justify-center gap-4 text-white"
            onClick={onOverlayClose}
          >
            <CancelRounded /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentsAddOverlay;
