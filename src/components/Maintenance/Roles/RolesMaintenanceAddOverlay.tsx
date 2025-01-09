import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";
import { useState, FormEvent } from "react";
import { AddOrUpdateRolePayloadInterface } from "@/types/RolesInterface";
import { useAddOrUpdateRoleMaintenance } from "@/app/hooks/role/useRoleAddOrUpdate";

const RoleAddOverlay = ({ onOverlayClose }: { onOverlayClose: () => void }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [authKey, setAuthKey] = useState<string | null>(null);

  const { mutate: addOrUpdateRole } = useAddOrUpdateRoleMaintenance();

  const initialRoleData: AddOrUpdateRolePayloadInterface = {
    Id: "",
    Name: "",
    Code: "",
  };

  const [descAddData, setDescAddData] = useState(initialRoleData);

  useState(() => {
    const key = getCookie("authKey") as string;
    setAuthKey(key);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "Code") {
      const formattedValue = value.replace(/ /g, "_").toUpperCase();
      setDescAddData({ ...descAddData, [name]: formattedValue });
    } else {
      setDescAddData({ ...descAddData, [name]: value });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { name } = e.target as HTMLInputElement;
    if (name === "Code" && e.key === " ") {
      e.preventDefault();

      const currentValue = (e.target as HTMLInputElement).value;
      setDescAddData({
        ...descAddData,
        [name]: currentValue + "_",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!descAddData.Name) {
      toast.error("Name is required.", { position: "top-right" });
      return;
    }

    if (!descAddData.Code) {
      toast.error("Code is required.", { position: "top-right" });
      return;
    }

    try {
      await addOrUpdateRole(descAddData);
      toast.success("Role saved successfully!", { position: "top-right" });
      //   onSuccess(descAddData);
      onOverlayClose();
    } catch (error) {
      toast.error("An error occurred while saving the role.", {
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
            Add Role
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
            Code:
            <span className="text-error">*</span>
          </p>
          <input
            name="Code"
            value={descAddData.Code || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
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

export default RoleAddOverlay;
