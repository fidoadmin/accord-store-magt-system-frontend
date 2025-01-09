import { AddOrUpdateClientPayloadInterface } from "@/types/ClientInterface";
import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";
import { useState, FormEvent } from "react";
import { AddOrUpdateBranchPayloadInterface } from "@/types/BranchInterface";
import { useAddOrUpdateBranch } from "@/app/hooks/branch/useBranchAddOrUpdate";

const BranchesMaintenanceAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: (newBranch: any) => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [authKey, setAuthKey] = useState<string | null>(null);

  const itemsPerPage = 20;
  const [category, setCategory] = useState<{ name?: string; id?: string }>({});

  const { mutate: addOrUpdateBranch } = useAddOrUpdateBranch();

  const initialBranchData = {
    Id: "",
    Name: "",
    Address: "",
    EmailAddress: "",
    PhoneNumber: "",
    IsEntryPoint: false,
  };

  const [descAddData, setDescAddData] =
    useState<AddOrUpdateBranchPayloadInterface>(initialBranchData);

  useState(() => {
    const key = getCookie("authKey") as "";
    setAuthKey(key);
  });

  const handleChange = (e: any) => {
    setDescAddData({ ...descAddData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setDescAddData({ ...descAddData, IsEntryPoint: !descAddData.IsEntryPoint });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!descAddData.Name) {
      toast.error("Name is required.", { position: "top-right" });
      return;
    }

    try {
      await addOrUpdateBranch(descAddData);
      toast.success("Branch saved successfully!", { position: "top-right" });
      onOverlayClose();
    } catch (error) {
      toast.error("An error occurred while saving the branch.", {
        position: "top-right",
      });
    }
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
        className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <div className="titleDiv">
          <h1 className="text-lg text-primary text-center font-bold">
            Add Branches
          </h1>
        </div>

        <div>
          <p className="text-text text-sm">
            Name: <span className="text-error">*</span>
          </p>
          <input
            name="Name"
            value={descAddData.Name || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <p className="text-text text-sm">
            Address:
            <span className="text-error">*</span>
          </p>
          <input
            name="Address"
            value={descAddData.Address || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">
            EmailAddress:
            <span className="text-error">*</span>
          </p>
          <input
            name="EmailAddress"
            value={descAddData.EmailAddress || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">
            Phonenumber:
            <span className="text-error">*</span>
          </p>
          <input
            name="PhoneNumber"
            value={descAddData.PhoneNumber || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-full px-4 py-2 mt-2 bg-white text-black">
          <label className="flex items-center">
            <p className="text-sm">Entry Point: </p>
            <input
              type="checkbox"
              checked={descAddData.IsEntryPoint}
              onChange={handleCheckboxChange}
              className="toggle-checkbox hidden"
            />
            <span
              className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                descAddData.IsEntryPoint ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                  descAddData.IsEntryPoint ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </span>
          </label>
          <span>{descAddData.IsEntryPoint ? "Yes" : "No"}</span>
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

export default BranchesMaintenanceAddOverlay;
