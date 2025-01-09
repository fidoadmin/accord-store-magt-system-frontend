import { useInventoryDescriptionDetails } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionDetail";
import React, { FormEvent, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { InventoryDescriptionDetailInterface } from "@/types/InventoryInterface";
import { useAddOrUpdateInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionAddOrUpdate";
import { useCompanyList } from "@/app/hooks/companies/useCompanyList";
import EditDropdown from "@/components/EditDropdown";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { CancelRounded, SaveRounded } from "@mui/icons-material";
import { useBranchDetails } from "@/app/hooks/branch/useBranchDetail";
import {
  AddOrUpdateBranchPayloadInterface,
  BranchDetailInterface,
} from "@/types/BranchInterface";
import { useAddOrUpdateBranch } from "@/app/hooks/branch/useBranchAddOrUpdate"; // Ensure this is the correct hook
import { addOrUpdateBranch as addOrUpdateBranchAPI } from "@/app/api/branchDE/branchAddOrUpdate"; // Ensure this is the correct API function

const BranchesMaintenanceEdit = ({
  Name,
  onSave,
}: {
  Name: BranchDetailInterface;
  onSave: (status: boolean) => void;
}) => {
  const authKey = getCookie("authKey") as string;
  const { mutateAsync: addOrUpdateBranch } = useAddOrUpdateBranch(); // Destructure the mutate function here
  // const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [category, setCategory] = useState<{ name?: string; id?: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;
  const { data: branchDetail } = useBranchDetails(
    authKey || "",
    Name?.Id || ""
  );

  const [branchEditData, setBranchEditData] = useState<BranchDetailInterface>({
    Id: Name?.Id,
    Name: Name?.Name,
    Address: Name?.Address,
    Emailaddress: Name?.Emailaddress,
    Phonenumber: Name?.Phonenumber,
    Companyguid: "string",
    Created: "string",
    Modified: "string",
    BranchId: "",
    BranchName: "",
  });
  useEffect(() => {
    setBranchEditData({
      Id: Name?.Id,
      Name: Name?.Name,
      Address: Name?.Address,
      Emailaddress: Name?.Emailaddress,
      Phonenumber: Name?.Phonenumber,
      Companyguid: "string",
      Created: "string",
      Modified: "string",
      BranchId: "",
      BranchName: "",
    });
  }, [Name]);

  // const handleSetOpenDropdown = (dropdownId: string) => {
  //   setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBranchEditData({ ...branchEditData, [e.target.name]: e.target.value });
  };

  // const handleSelectManufacturer = (option: { id: string; name: string }) => {
  //   setBranchEditData({
  //     ...branchEditData,
  //     BranchId: option.id,
  //     BranchName: option.name,
  //   });
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: AddOrUpdateBranchPayloadInterface = {
      Id: branchEditData.Id,
      Name: branchEditData.Name,
      Address: branchEditData.Address,
      Emailaddress: branchEditData.Emailaddress,
      Phonenumber: branchEditData.Phonenumber,
      Companyguid: branchEditData.Companyguid,
    };
    try {
      await addOrUpdateBranch(payload); // Call the mutate function
      onSave(true);
    } catch (error) {
      console.error("Operation Failed", error);
    }

    onSave(false);
  };

  return (
    <div className="text-center flex-1 flex flex-col gap-2">
      <div className="bg-background rounded-xl h-full max-h-20 flex gap-2 items-center justify-center p-2">
        <label className="w-full">Branch Name: </label>
        <input
          name="BranchName"
          onChange={handleChange}
          value={branchEditData.BranchName} // Use BranchName here
          className="w-full text-left font-bold py-1 pl-4 rounded-xl inner-border-2 inner-border-primary"
        />
      </div>
      <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
        <div className="label w-full space-y-1">
          <p className="label w-full">Address:</p>
          <p className="label w-full text-sm">Email Address:</p>
        </div>
        <div className="w-full space-y-1">
          <input
            name="Address"
            onChange={handleChange}
            value={branchEditData.Address}
            className="w-full text-left font-bold py-1 pl-4 rounded-xl inner-border-2 inner-border-primary"
          />
          <input
            name="Emailaddress"
            onChange={handleChange}
            value={branchEditData.Emailaddress}
            className="w-full text-left font-bold text-sm py-1 pl-4 rounded-xl inner-border-2 inner-border-primary"
          />
        </div>
      </div>
      <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
        <p className="label w-full ">Phone Number:</p>
        <input
          name="Phonenumber"
          onChange={handleChange}
          value={branchEditData.Phonenumber}
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
          onClick={() => {
            onSave(false);
          }}
        >
          <CancelRounded />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BranchesMaintenanceEdit;
