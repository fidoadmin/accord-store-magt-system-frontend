"use client";
import { useState, FormEvent, useEffect } from "react";
import React from "react";
import { getCookie } from "cookies-next";
import { useAddOrUpdateInventory } from "@/app/hooks/inventories/useInventoryAddOrUpdate";
import { useRouter } from "next/navigation";
import { useContainers } from "@/app/hooks/containers/useContainerList";
import "react-datepicker/dist/react-datepicker.css";
import { CancelRounded, SaveRounded } from "@mui/icons-material";
import { UpdateInventoryFormPropsInterface } from "@/types/ComponentInterface";
import Loading from "@/app/loading";

const UpdateInventoryForm: React.FC<UpdateInventoryFormPropsInterface> = ({
  inventory,
  onSave,
}) => {
  const [formData, setFormData] = useState({ ...inventory });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedContainer, setSelectedContainer] = useState<string | null>(
    formData.ContainerType
  );
  const [startManufactureDate, setStartManufactureDate] = useState<Date | null>(
    new Date(formData.ManufactureDate)
  );
  const [startExpiryDate, setStartExpiryDate] = useState<Date | null>(
    startManufactureDate
  );
  const addOrUpdateInventory = useAddOrUpdateInventory();
  const [isExpiry, setIsExpiry] = useState<boolean>(true);
  const authKey = getCookie("authKey") as string;
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  useEffect(() => {
    setSelectedCategory(formData.CategoryId);
  }, [formData.CategoryId]);

  const {
    data: containerData,
    error: containerError,
    isLoading: containerLoading,
  } = useContainers(authKey || "", { categoryId: selectedCategory });

  const handleManufactureDateSelect = (value: string) => {
    let formattedValue = value.replace(/[^\d-]/g, "");

    if (formattedValue.length > 4 && formattedValue[4] !== "-") {
      formattedValue =
        formattedValue.slice(0, 4) + "-" + formattedValue.slice(4);
    }
    if (formattedValue.length > 7 && formattedValue[7] !== "-") {
      formattedValue =
        formattedValue.slice(0, 7) + "-" + formattedValue.slice(7);
    }
    if (formattedValue.length > 10) {
      formattedValue = formattedValue.slice(0, 10);
    }

    console.log("date: " + formattedValue);

    setFormData((prevData) => ({
      ...prevData,
      ManufactureDate: formattedValue,
    }));
  };

  const handleExpiryDateSelect = (value: string) => {
    let formattedValue = value.replace(/[^\d-]/g, "");

    if (formattedValue.length > 4 && formattedValue[4] !== "-") {
      formattedValue =
        formattedValue.slice(0, 4) + "-" + formattedValue.slice(4);
    }
    if (formattedValue.length > 7 && formattedValue[7] !== "-") {
      formattedValue =
        formattedValue.slice(0, 7) + "-" + formattedValue.slice(7);
    }
    if (formattedValue.length > 10) {
      formattedValue = formattedValue.slice(0, 10);
    }

    setFormData((prevData) => ({
      ...prevData,
      ExpirationDate: formattedValue,
    }));
  };

  const handleSelectContainer = (option: { id: string; name: string }) => {
    setSelectedContainer(option.name);
    setFormData({ ...formData, ContainerType: option.name });
  };

  const handleSelectPackSize = (option: { id: string; name: string }) => {
    setFormData({
      ...formData,
      ContainerId: option.id,
      PackSize: option.name,
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "Shelf" ? value.toUpperCase() : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await addOrUpdateInventory.mutateAsync({
        ...formData,
      });
      router.push(
        `/inventory/details/${inventory.InventoryDescriptionId}/${result.id}`
      );
    } catch (error) {
      console.error("Failed to add or update inventory:", error);
    }
    onSave(false);
  };

  if (containerLoading || !containerData) {
    return <Loading />;
  }

  if (containerError) {
    return <div>Error Loading Data</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mb-4">
      <div className="container p-4">
        <div className="">
          <h1 className="text-lg md:text-2xl font-black text-primary text-center">
            {formData?.Description}
          </h1>
          <h1 className="md:text-lg font-black text-text text-center">
            {formData?.CategoryName}
          </h1>
        </div>
      </div>
      <div className="text-center bg-surface p-4 rounded-xl">
        <p className="text-primary font-semibold">Bar Code</p>
        <p className="text-text">{formData?.BarCode}</p>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:px-8 py-4">
          <div className="flex text-left  gap-2">
            <label className="text-primary font-semibold">HS Code:</label>
            <input
              className="flex-1 text-text bg-surface inner-border-2 inner-border-primary rounded-lg text-left pl-2"
              name="HSCode"
              value={formData.HSCode || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex text-left  gap-2">
            <label className="text-primary font-semibold">Serial Number:</label>
            <input
              className="flex-1 text-text bg-surface inner-border-2 inner-border-primary rounded-lg text-left pl-2"
              name="SerialNumber"
              value={formData.SerialNumber || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex text-left  gap-2">
            <label className="text-primary font-semibold">PI Number:</label>
            <input
              className="flex-1 text-text bg-surface inner-border-2 inner-border-primary rounded-lg text-left pl-2"
              name="ProformaInvoiceNumber"
              value={formData.ProformaInvoiceNumber || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex text-left  gap-2">
            <label className="text-primary font-semibold">
              Invoice Number:
            </label>
            <input
              className="flex-1 text-text bg-surface inner-border-2 inner-border-primary rounded-lg text-left pl-2"
              name="InvoiceNumber"
              value={formData.InvoiceNumber || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex text-left  gap-2">
            <label className="text-primary font-semibold">PO Number:</label>
            <input
              className="flex-1 text-text bg-surface inner-border-2 inner-border-primary rounded-lg text-left pl-2"
              name="PurchaseOrderNumber"
              value={formData.PurchaseOrderNumber || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex text-left  gap-4">
            <h1 className="text-primary font-semibold">Short Name:</h1>
            <h1 className="text-text">{formData.ShortName}</h1>
          </div>
          <div className="flex text-left  gap-2">
            <label className="text-primary font-semibold">Batch Number:</label>
            <input
              className="flex-1 text-text bg-surface inner-border-2 inner-border-primary rounded-lg text-left pl-2"
              name="BatchNumber"
              value={formData.BatchNumber || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:px-8 bg-surface rounded-xl py-4">
          <div className="flex text-left  gap-4">
            <h1 className="text-primary font-semibold">Company:</h1>
            <h1 className="text-text">{formData.CompanyName}</h1>
          </div>
          <div className="flex text-left  gap-4">
            <h1 className="text-primary font-semibold">Branch:</h1>
            <h1 className="text-text">{formData.BranchName}</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:px-8 py-4">
          {/* <div className="flex text-left gap-4">
            <label className="text-primary font-semibold">Manufacturer:</label>container mx-auto p-4
            <h1 className="text-text">{formData.ManufacturerName}</h1>
          </div> */}
          <div className="flex text-left  gap-4">
            <h1 className="text-primary font-semibold">Supplier:</h1>
            <h1 className="text-text">{formData.SupplierName}</h1>
          </div>

          {/* {formData.ManufactureDate && ( */}
          <div className="flex text-left gap-4">
            <label className="block text-lg  text-primary font-semibold">
              Manufacture Date:
            </label>
            <input
              type="text"
              name="ManufactureDate"
              autoComplete="off"
              value={formData.ManufactureDate || ""}
              placeholder="YYYY/MM/DD"
              onChange={(e) => handleManufactureDateSelect(e.target.value)}
              className="flex-1 text-text bg-surface inner-border-2 inner-border-primary rounded-lg text-left pl-2"
            />
          </div>

          <div className={`${isExpiry ? "" : "hidden"}`}>
            <div className="flex text-left gap-4">
              <label className="block text-lg text-primary font-semibold">
                Expiration Date:<span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="ExpirationDate"
                autoComplete="off"
                value={formData.ExpirationDate || ""}
                placeholder="YYYY/MM/DD"
                onChange={(e) => handleExpiryDateSelect(e.target.value)}
                required={isExpiry}
                className="flex-1 text-text bg-surface inner-border-2 inner-border-primary rounded-lg text-left pl-2"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:px-8 bg-surface rounded-xl py-4">
          <div className="flex text-left gap-2">
            <h1 className="text-primary font-semibold">Pack Size:</h1>
            <h1 className="text-text">
              {formData.ContainerType} of {formData.PackSize}
            </h1>
          </div>

          <div className="flex text-left gap-4">
            <label className="text-primary font-semibold">Quantity:</label>
            <h1 className="text-text">{formData.Quantity}</h1>
          </div>
          <div className="flex text-left gap-2">
            <label className="text-primary font-semibold">Location:</label>
            <input
              className="flex-1 text-text bg-surface inner-border-2 inner-border-primary rounded-xl text-left pl-2"
              name="Shelf"
              value={formData.Shelf || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex text-left gap-2">
            <label className="text-primary font-semibold">Remarks:</label>
            <input
              className="flex-1 text-text bg-surface inner-border-2 inner-border-primary rounded-xl text-left pl-2"
              name="Remarks"
              value={formData.Remarks || ""}
              onChange={handleChange}
            />
            <div className="w-1/2"></div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 space-y-2">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSave(false)}
            className="group bg-error text-white px-4 py-2 rounded-xl shadow-lg hover:bg-errorAccent transition"
            title="Cancel"
          >
            <span className="hidden group-hover:inline pr-2">Cancel</span>
            <CancelRounded />
          </button>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="group bg-success text-white px-4 py-2 rounded-xl shadow-lg hover:bg-successAccent transition"
            title="Save"
          >
            <span className="hidden group-hover:inline pr-2">Save</span>
            <SaveRounded />
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateInventoryForm;
