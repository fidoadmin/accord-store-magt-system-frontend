import { useClientList } from "@/app/hooks/client/useClientList";
import { useCompanyList } from "@/app/hooks/companies/useCompanyList";
import { useRoleList } from "@/app/hooks/role/useRoleList";
import { useAddOrUpdateUserMaintenance } from "@/app/hooks/user/useUserAddOrUpdate";
import Dropdown from "@/components/Dropdown";
import { ClientDetailInterface } from "@/types/ClientInterface";
import {
  CompanyDetailInterface,
  CompanyInterface,
} from "@/types/CompanyInterface";
import { RoleDetailInterface } from "@/types/RolesInterface";
import { AddOrUpdateUserPayloadInterface } from "@/types/UserInterface";
import {
  SaveRounded,
  CancelRounded,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { getCookie } from "cookies-next";
import { useState, FormEvent } from "react";
import { toast } from "react-toastify";

const UserAddOverlay = ({ onOverlayClose }: { onOverlayClose: () => void }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [visible, setVisible] = useState<boolean>(false);
  const [reVisible, setReVisible] = useState<boolean>(false);

  const itemsPerPage = 20;
  const [category, setCategory] = useState<{ name?: string; id?: string }>({});

  const { mutate: addOrUpdateUser } = useAddOrUpdateUserMaintenance();

  const initialInventoryData = {
    Id: "",
    FirstName: "",
    LastName: "",
    Address: "",
    EmailAddress: "",
    PhoneNumber: "",
    Password: "",
  };

  const { data: clientList, isLoading: clientLoading } = useClientList(
    authKey || "",
    { page: currentPage, limit: itemsPerPage }
  );

  const {
    data: roleList,
    error: roleError,
    isLoading: roleLoading,
  } = useRoleList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy,
    sortOrder,
  });

  const {
    data: CompanyData,
    error: CompanyError,
    isLoading: CompanyLoading,
  } = useCompanyList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy: sortBy,
    sortOrder: sortOrder,
    isinternal: "",
  });

  const [descAddData, setDescAddData] =
    useState<AddOrUpdateUserPayloadInterface>(initialInventoryData);

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

  const handleSelectClient = (option: { id: string }) => {
    setDescAddData((prevData) => ({
      ...prevData,
      ClientId: option.id,
    }));
  };
  const handleSelectRole = (option: { id: string }) => {
    setDescAddData((prevData) => ({
      ...prevData,
      RoleId: option.id,
    }));
  };
  const handleSelectCompany = (option: { id: string }) => {
    setDescAddData((prevData) => ({
      ...prevData,
      CompanyId: option.id,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Ensure required fields are provided
    if (!descAddData.FirstName) {
      toast.error("FirstName is required.", { position: "top-right" });
      return;
    }

    if (!descAddData.EmailAddress) {
      toast.error("Emailaddress is required.", { position: "top-right" });
      return;
    }

    if (descAddData.Password !== descAddData.RePassword) {
      toast.error("Passwords do not match.", { position: "top-right" });
      return;
    }

    if (!descAddData.Id) {
      const { Id, ...payloadData } = descAddData;
      try {
        await addOrUpdateUser(payloadData);
        toast.success("User saved successfully!", { position: "top-right" });
        onOverlayClose();
      } catch (error) {
        toast.error("An error occurred while saving the user.", {
          position: "top-right",
        });
      }
    } else {
      try {
        await addOrUpdateUser(descAddData);
        toast.success("User updated successfully!", { position: "top-right" });
        onOverlayClose();
      } catch (error) {
        toast.error("An error occurred while saving the user.", {
          position: "top-right",
        });
      }
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
            Add User
          </h1>
        </div>

        <div>
          <p className="text-text text-sm">
            First Name: <span className="text-error">*</span>
          </p>
          <input
            name="FirstName"
            value={descAddData.FirstName || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">
            Last Name:
            <span className="text-error">*</span>
          </p>
          <input
            name="LastName"
            value={descAddData.LastName || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <p className="text-text text-sm">
            Email Address:<span className="text-error">*</span>
          </p>
          <input
            name="EmailAddress"
            value={descAddData.EmailAddress || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">Phone Number:</p>
          <input
            name="PhoneNumber"
            value={descAddData.PhoneNumber || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-text text-sm">Address:</p>
          <input
            name="Address"
            value={descAddData.Address || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>

        {/* <div>
          <p className="text-text text-sm">Client Name:</p>
          <input
            name="Clientname"
            value={descAddData.Clientname || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div> */}

        <Dropdown
          label="Client"
          showLabel
          options={
            clientList?.data?.map((client: ClientDetailInterface) => ({
              id: client.Id!,
              name: client.Name!,
            })) ?? []
          }
          isOpen={openDropdown === "clients"}
          setIsOpen={() => handleSetOpenDropdown("clients")}
          onSelect={handleSelectClient}
          placeholder="Select a client"
          required
        />
        <Dropdown
          label="Role"
          showLabel
          options={
            roleList?.data?.map((role: RoleDetailInterface) => ({
              id: role.Id!,
              name: role.Name!,
            })) ?? []
          }
          isOpen={openDropdown === "roles"}
          setIsOpen={() => handleSetOpenDropdown("roles")}
          onSelect={handleSelectRole}
          placeholder="Select a Role"
          required
        />
        <Dropdown
          label="Company"
          showLabel
          options={
            CompanyData?.data.map((company: CompanyInterface) => ({
              id: company.Id!,
              name: company.Name!,
            })) ?? []
          }
          isOpen={openDropdown === "companies"}
          setIsOpen={() => handleSetOpenDropdown("companies")}
          onSelect={handleSelectCompany}
          placeholder="Select a Company"
          required
        />

        <div className="relative w-full">
          <p className="text-text text-sm">
            Password:
            <span className="text-error">*</span>
          </p>
          <div className="relative">
            <input
              id="Password"
              name="Password"
              type={visible ? "text" : "password"}
              value={descAddData.Password || ""}
              className="w-full inner-border-2 inner-border-primary rounded-xl p-2 pr-10"
              onChange={handleChange}
              required
            />
            <span
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              onClick={() => {
                setVisible(!visible);
              }}
            >
              {visible ? <VisibilityRounded /> : <VisibilityOffRounded />}
            </span>
          </div>
        </div>

        <div className="relative w-full">
          <p className="text-text text-sm">
            Re-Password:
            <span className="text-error">*</span>
          </p>
          <div className="relative">
            <input
              id="Repassword"
              name="RePassword"
              type={reVisible ? "text" : "password"}
              value={descAddData.RePassword || ""}
              className="w-full inner-border-2 inner-border-primary rounded-xl p-2 pr-10"
              onChange={handleChange}
              required
            />
            <span
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              onClick={() => {
                setReVisible(!reVisible);
              }}
            >
              {reVisible ? <VisibilityRounded /> : <VisibilityOffRounded />}
            </span>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-5">
          <button
            className="bg-success rounded-xl p-2 w-40 flex items-center justify-center gap-4 text-white"
            onClick={handleSubmit}
            // disabled={isLoading} // Disable the button while loading
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

export default UserAddOverlay;
