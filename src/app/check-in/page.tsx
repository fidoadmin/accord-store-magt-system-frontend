"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { getCookie } from "cookies-next";
import { useAddOrUpdateInventory } from "@/app/hooks/inventories/useInventoryAddOrUpdate";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";
import { useBranchList } from "../hooks/branches/useBranchList";
import { useCompanyList } from "../hooks/companies/useCompanyList";
import { useAgentList } from "../hooks/agents/useAgentList";
import BarcodeInputForm from "@/components/BarcodeInputForm";
import ConfirmationModal from "@/components/CancelConfirmationModal";
import "react-datepicker/dist/react-datepicker.css";
import { useContainers } from "../hooks/containers/useContainerList";
import { useInventoryDescriptionForMaintenance } from "../hooks/inventorydescriptions/useInventoryDescriptionForMaintenance";
import { useInventoryDescriptionDetails } from "../hooks/inventorydescriptions/useInventoryDescriptionDetail";
import { toast } from "react-toastify";
import Loading from "../loading";
import React from "react";

export default function CheckInPage() {
  const [isExpiry, setIsExpiry] = useState<boolean>(true);
  const [selectedContainer, setSelectedContainer] = useState<{
    name?: string;
    id?: string;
  }>({});

  const [manufactureDate, setManufactureDate] = useState<Date | null>(
    new Date()
  );
  const [startExpiryDate, setStartExpiryDate] = useState<Date | null>(
    manufactureDate
  );

  const [authKey, setAuthKey] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const initialInventoryData = {
    AgentId: "",
    AgentName: "",
    BarCode: "",
    BatchNumber: "",
    BranchId: "",
    CategoryId: "",
    CompanyId: "",
    ContainerId: "",
    ContainerType: "",
    ExpirationDate: "",
    HSCode: "",
    InventoryDescriptionId: "",
    ManufactureDate: "",
    ModelNumber: "",
    PartNumber: "",
    PurchaseOrderNumber: "",
    ProformaInvoiceNumber: "",
    InvoiceNumber: "",
    Remarks: "",
    Shelf: "",
    SerialNumber: "",
    Quantity: 0,
    SupplierId: "",
    ChallanContainerUnit: "",
  };
  const [inventoryData, setInventoryData] = useState(initialInventoryData);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [smallUnit, setSmallUnit] = useState<string | undefined>(undefined);

  const [formError, setFormError] = useState<string[] | null>(null);
  const [formCancelled, setFormCancelled] = useState<boolean>(false);
  const [category, setCategory] = useState<{ name?: string; id?: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const itemsPerPage = 20;

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const {
    data: inventoryDescriptionData,
    error: inventoryDescriptionError,
    isLoading: inventoryDescriptionLoading,
  } = useInventoryDescriptionForMaintenance(authKey || "", {
    categoryId: inventoryData.CategoryId,
  });
  console.log();
  const {
    data: inventoryDescriptionDetails,
    error: inventoryDescriptionDetailsError,
    isLoading: inventoryDescriptionDetailsLoading,
  } = useInventoryDescriptionDetails(
    authKey || "",
    inventoryData.InventoryDescriptionId
  );

  useEffect(() => {
    if (inventoryData.InventoryDescriptionId && inventoryDescriptionDetails) {
      setInventoryData((prevData) => ({
        ...prevData,
        ManufacturerName:
          inventoryDescriptionDetails?.ManufacturerName as string,
        ShortName: inventoryDescriptionDetails?.ShortName as string,
      }));
    }
  }, [inventoryDescriptionDetails, inventoryData.InventoryDescriptionId]);

  const {
    data: containerList,
    error: containerError,
    isLoading: containerLoading,
  } = useContainers(authKey || "", { categoryId: inventoryData.CategoryId });

  const {
    data: categoryList,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategoryList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    categoryId: category?.id || "",
  });
  const {
    data: branchData,
    error: branchError,
    isLoading: branchLoading,
  } = useBranchList(authKey || "", {
    page,
    limit,
  });
  const {
    data: InternalCompanyData,
    error: CompanyError,
    isLoading: CompanyLoading,
  } = useCompanyList(authKey || "", {
    page,
    limit,
    isinternal: "true",
  });

  const { data: SupplierData } = useCompanyList(authKey || "", {
    page,
    limit,
    issupplier: "true",
  });

  const addOrUpdateInventory = useAddOrUpdateInventory();
  const router = useRouter();

  const handleSelectCategory = (option: {
    id: string;
    name: string;
    isExpiry?: boolean;
  }) => {
    setInventoryData({
      ...inventoryData,
      CategoryId: option.id,
    });
  };

  const handleValidation = () => {
    let missingFields: string[] = [];

    if (!inventoryData.ContainerId) missingFields.push("PackSize");
    if (!selectedContainer.name) missingFields.push("Container");
    if (!inventoryData.SupplierId) missingFields.push("Supplier");
    if (!inventoryData.BranchId) missingFields.push("Branch");
    if (!inventoryData.CompanyId) missingFields.push("Company");

    setFormError(missingFields);

    if (missingFields.length > 0) {
      toast.error(`Incomplete form. Please fill all required fields!`);
    }

    return missingFields;
  };

  const handleSelectDescription = (option: {
    id: string;
    name: string;
    isExpiry?: boolean;
  }) => {
    setInventoryData({
      ...inventoryData,
      InventoryDescriptionId: option.id,
      ContainerId: "",
    });
    setSelectedContainer({});
    setIsExpiry(option.isExpiry ? option.isExpiry : false);
  };

  useEffect(() => {
    if (inventoryData.InventoryDescriptionId && inventoryDescriptionDetails) {
      setInventoryData((prevData) => ({
        ...prevData,
        ManufacturerName:
          inventoryDescriptionDetails?.ManufacturerName as string,
        ShortName: inventoryDescriptionDetails?.ShortName as string,
      }));
    }
  }, [inventoryDescriptionDetails, inventoryData.InventoryDescriptionId]);

  const handleSelectAgent = (option: { id: string; name: string }) => {
    setInventoryData({
      ...inventoryData,
      AgentId: option.id,
    });
  };

  const handleSelectContainer = (option: { id: string; name: string }) => {
    const companyId = inventoryData.CompanyId;
    const categoryId = inventoryData.CategoryId;
    const descriptionId = inventoryData.InventoryDescriptionId;

    setSelectedContainer({ name: option.name, id: option.id });
    setInventoryData({
      ...initialInventoryData,
      ContainerType: option.name,
      CompanyId: companyId,
      CategoryId: categoryId,
      InventoryDescriptionId: descriptionId,
    });
  };

  const handleSelectPackSize = (option: { id: string; name: string }) => {
    setInventoryData({
      ...inventoryData,
      ContainerId: option.id,
    });
    console.log(containerList?.data);
    const containerDetails = containerList?.data.find(
      (item) => (item.Id = option.id)
    );
    const packSizeDetails = containerDetails?.PackSize.find(
      (item) => (item.ContainerId = option.id)
    );
    setSmallUnit(packSizeDetails?.SmallUnit);
  };

  const handleChallanUnit = (option: { id: string; name: string }) => {
    setInventoryData({
      ...inventoryData,
      ChallanContainerUnit: option.id,
    });
  };

  const handleSelectBranch = (option: { id: string; name: string }) => {
    setInventoryData({
      ...inventoryData,
      BranchId: option.id,
    });
  };

  const handleSelectCompany = (option: { id: string; name: string }) => {
    setInventoryData({
      ...initialInventoryData,
      CompanyId: option.id,
    });
  };

  const handleSelectSupplier = (option: { id: string; name: string }) => {
    setInventoryData({
      ...inventoryData,
      SupplierId: option.id,
    });
  };

  const handleManufactureDateSelect = (value: string) => {
    let formattedValue = value.replace(/[^\d-]/g, "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(formattedValue)) {
      setInventoryData((prevData) => ({
        ...prevData,
        ManufactureDate: formattedValue,
      }));
    } else {
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

      setInventoryData((prevData) => ({
        ...prevData,
        ManufactureDate: formattedValue,
      }));
    }
  };

  const handleExpiryDateSelect = (value: string) => {
    let formattedValue = value.replace(/[^\d-]/g, "");

    if (/^\d{4}-\d{2}-\d{2}$/.test(formattedValue)) {
      setInventoryData((prevData) => ({
        ...prevData,
        ExpirationDate: formattedValue,
      }));
    } else {
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

      setInventoryData((prevData) => ({
        ...prevData,
        ExpirationDate: formattedValue,
      }));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInventoryData({
      ...inventoryData,
      [name]: name === "Shelf" ? value.toUpperCase() : value,
    });
  };

  const handleBarcodeSubmit = (barcode: string) => {
    setInventoryData({
      ...inventoryData,
      BarCode: barcode,
    });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (handleValidation().length) return;
    try {
      const result = await addOrUpdateInventory.mutateAsync({
        ...inventoryData,
      });
      router.push(
        `/inventory/details/${inventoryData.InventoryDescriptionId}/${result.id}`
      );
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    }
  };

  const handleCancel = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmNavigation = () => {
    setInventoryData(initialInventoryData);
    setFormCancelled(true);
    setShowConfirmationModal(false);
    window.location.reload();
  };

  const handleDismissNavigation = () => {
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    const key = getCookie("authKey") as "";
    setAuthKey(key);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!formCancelled) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formCancelled, showConfirmationModal]);

  if (
    (categoriesLoading && CompanyLoading && branchLoading) ||
    (!category && !InternalCompanyData && !branchData)
  ) {
    return <Loading />;
  }

  if (categoriesError || CompanyError || branchError || containerError)
    return (
      <div className="text-error font-bold text-center">
        Error loading check-in form:{" "}
        {categoriesError?.message ||
          CompanyError?.message ||
          branchError?.message ||
          containerError?.message}
      </div>
    );

  return (
    <>
      <div className="check-in-page py-2 space-y-4 flex flex-col justify-center items-center w-full sm:w-2/3 lg:w-1/2 mx-auto">
        <div>
          <h1 className="font-bold text-text text-lg">Inventory Check-in</h1>
        </div>
        <div className="container mx-auto md:p-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="companySelector">
              <Dropdown
                label="Company"
                showLabel
                options={
                  InternalCompanyData?.data.map((buyer) => ({
                    id: buyer.Id,
                    name: buyer.Name,
                    external: buyer.IsExternal,
                  })) ?? []
                }
                isOpen={openDropdown === "buyer"}
                setIsOpen={() => handleSetOpenDropdown("buyer")}
                onSelect={handleSelectCompany}
                placeholder="Company"
                required
                search
                error={
                  formError?.includes("Company") && !inventoryData.CompanyId
                }
              />
              {formError?.includes("Company") && !inventoryData.CompanyId && (
                <p className="text-xs text-error">Please select a company</p>
              )}
            </div>
            {!!inventoryData.CompanyId && (
              <div className="flex gap-2">
                <Dropdown
                  label="Category"
                  options={
                    categoryList?.map((category) => ({
                      id: category.Id,
                      name: category.Name,
                    })) ?? []
                  }
                  isOpen={openDropdown === "category"}
                  setIsOpen={() => handleSetOpenDropdown("category")}
                  onSelect={handleSelectCategory}
                  placeholder="Categories"
                  required
                  search
                />

                <Dropdown
                  label="Description"
                  options={
                    inventoryDescriptionData?.data.map((description) => ({
                      id: description.Id,
                      isExpiry: description.HasExpiryDate,
                      name: `${
                        !!description.ShortName
                          ? `${description.ShortName} (${description.Description} )`
                          : `${description.Description}`
                      }`,
                    })) ?? []
                  }
                  isOpen={openDropdown === "description"}
                  setIsOpen={() => handleSetOpenDropdown("description")}
                  onSelect={handleSelectDescription}
                  placeholder="Description"
                  required
                  search
                  disabled={!inventoryData.CategoryId}
                />
              </div>
            )}

            {!!inventoryData.CategoryId.length &&
              !!inventoryData.InventoryDescriptionId.length && (
                <div className="flex gap-2">
                  <div className="w-full">
                    <Dropdown
                      label="Container"
                      options={
                        containerList?.data.map((container) => ({
                          id: container.Type,
                          name: container.Type,
                        })) ?? []
                      }
                      required
                      isOpen={openDropdown === "container"}
                      setIsOpen={() => handleSetOpenDropdown("container")}
                      onSelect={handleSelectContainer}
                      placeholder="Container"
                      error={
                        formError?.includes("Container") &&
                        !selectedContainer.name
                      }
                    />
                    {formError?.includes("Container") &&
                      !selectedContainer.name && (
                        <p className="text-xs text-error">
                          Please select a container
                        </p>
                      )}
                  </div>
                  <div className="w-full">
                    <Dropdown
                      label="Pack Size"
                      options={
                        containerList?.data
                          .filter(
                            (container) =>
                              container.Type === selectedContainer.name
                          )
                          .flatMap((filteredContainer) =>
                            filteredContainer.PackSize?.map((pack) => ({
                              id: pack.ContainerId,
                              name: pack.Packsize,
                            }))
                          ) ?? []
                      }
                      required
                      isOpen={openDropdown === "packSize"}
                      setIsOpen={() => handleSetOpenDropdown("packSize")}
                      onSelect={handleSelectPackSize}
                      placeholder="Pack Size"
                      error={
                        formError?.includes("PackSize") &&
                        !inventoryData.ContainerId
                      }
                      disabled={!selectedContainer.id?.length}
                    />
                    {formError?.includes("Container") &&
                      !inventoryData.ContainerId && (
                        <p className="text-xs text-error">
                          Please select a pack size
                        </p>
                      )}
                  </div>
                  {!!inventoryData.CategoryId.length &&
                    !!inventoryData.InventoryDescriptionId.length &&
                    !!inventoryData.ContainerId.length &&
                    !!selectedContainer && (
                      <div className="flex justify-between mb-1 w-full h-10 border border-gray-300  rounded-xl shadow-sm px-4 py-2 bg-white text-sm font-medium">
                        {smallUnit}
                      </div>
                    )}
                </div>
              )}

            {!!inventoryData.CategoryId.length &&
              !!inventoryData.InventoryDescriptionId.length &&
              !!inventoryData.ContainerId.length &&
              !!selectedContainer && (
                <BarcodeInputForm onChange={handleBarcodeSubmit} />
              )}

            {!!inventoryData.BarCode &&
              !!inventoryData.CategoryId.length &&
              !!inventoryData.InventoryDescriptionId &&
              !!inventoryData.CompanyId && (
                <>
                  <div className="mainForm space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          HS Code
                        </label>
                        <input
                          type="string"
                          name="HSCode"
                          autoComplete="off"
                          value={inventoryData.HSCode}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="HS Code"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Serial Number
                        </label>
                        <input
                          type="string"
                          name="SerialNumber"
                          autoComplete="off"
                          value={inventoryData.SerialNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="Serial Number"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Batch Number
                          {/* <span className="text-error">*</span> */}
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="BatchNumber"
                          value={inventoryData.BatchNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="Batch Number"
                          // required
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          PI Number
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="ProformaInvoiceNumber"
                          value={inventoryData.ProformaInvoiceNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="PI Number"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Invoice Number{" "}
                          {!!inventoryData.ProformaInvoiceNumber && (
                            <span className="text-error">*</span>
                          )}
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="InvoiceNumber"
                          value={inventoryData.InvoiceNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="Invoice Number"
                          required={!!inventoryData.ProformaInvoiceNumber}
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs text-text">
                          PO Number
                        </label>
                        <input
                          type="string"
                          autoComplete="off"
                          name="PurchaseOrderNumber"
                          value={inventoryData.PurchaseOrderNumber}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="PO Number"
                        />
                      </div>

                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Short Name
                        </label>
                        <input
                          type="string"
                          name="ShortName"
                          value={inventoryDescriptionDetails?.ShortName}
                          onChange={handleInputChange}
                          disabled
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm border border-primary text-primary opacity-40"
                          placeholder="Short Name"
                        />
                      </div>

                      <div className="">
                        <Dropdown
                          label="Branch"
                          showLabel
                          options={
                            branchData?.data.map((branch) => ({
                              id: branch.Id,
                              name: branch.Name,
                              entryPoint: branch.IsEntryPoint,
                            })) ?? []
                          }
                          isOpen={openDropdown === "branch"}
                          setIsOpen={() => handleSetOpenDropdown("branch")}
                          onSelect={handleSelectBranch}
                          placeholder="Branch"
                          required={true}
                          error={
                            formError?.includes("Branch") &&
                            !inventoryData.BranchId
                          }
                        />
                        {formError?.includes("Branch") &&
                          !inventoryData.BranchId && (
                            <p className="text-xs text-error">
                              Please select a branch
                            </p>
                          )}
                      </div>

                      <div className="">
                        <label className="block text-xs text-text">
                          Manufacturer
                        </label>
                        <input
                          type="text"
                          disabled
                          value={inventoryDescriptionDetails?.ManufacturerName}
                          placeholder="Manufacturer"
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm border border-primary text-primary opacity-40"
                        />
                      </div>
                      <div className="">
                        <Dropdown
                          label="Supplier"
                          showLabel
                          options={
                            SupplierData?.data?.map((supplier) => ({
                              id: supplier.Id,
                              name: supplier.Name,
                              external: supplier.IsExternal,
                            })) ?? []
                          }
                          isOpen={openDropdown === "supplier"}
                          required
                          search
                          setIsOpen={() => handleSetOpenDropdown("supplier")}
                          onSelect={handleSelectSupplier}
                          placeholder="Supplier"
                          error={
                            formError?.includes("Supplier") &&
                            !inventoryData.SupplierId
                          }
                        />

                        {formError?.includes("Supplier") &&
                          !inventoryData.SupplierId && (
                            <p className="text-xs text-error">
                              Please select a supplier
                            </p>
                          )}
                      </div>
                      <div className="relative">
                        <label className="block text-xs text-text">
                          Manufacture Date
                        </label>
                        <input
                          type="text"
                          name="ManufactureDate"
                          autoComplete="off"
                          value={inventoryData.ManufactureDate}
                          placeholder="YYYY/MM/DD"
                          onChange={(e) =>
                            handleManufactureDateSelect(e.target.value)
                          }
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary focus:outline-primary focus:ring-0 focus:outline-none"
                        />
                      </div>

                      <div className={`${isExpiry ? "" : "hidden"}`}>
                        <label className="block text-xs text-text">
                          Expiration Date<span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          name="ExpirationDate"
                          autoComplete="off"
                          value={inventoryData.ExpirationDate}
                          placeholder="YYYY/MM/DD"
                          onChange={(e) =>
                            handleExpiryDateSelect(e.target.value)
                          }
                          required={isExpiry}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary focus:outline-primary focus:ring-0 focus:outline-none"
                        />
                      </div>
                      <div className="">
                        <label className="block text-xs text-text">
                          Location <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          name="Shelf"
                          value={inventoryData.Shelf}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="Inventory Location"
                          required
                        />
                      </div>

                      <div className="w-full">
                        <label className="block text-xs text-text">
                          Remarks
                        </label>
                        <input
                          type="text"
                          name="Remarks"
                          value={inventoryData.Remarks}
                          onChange={handleInputChange}
                          className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
                          placeholder="Remarks"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-row-2 gap-2 w-60 mx-auto">
                    <button
                      type="submit"
                      className="submit-button md:border-2 text-text md:text-success max-md:bg-success  md:border-success py-2 px-4 md:hover:bg-success md:hover:text-white rounded-xl disabled:bg-primary disabled:opacity-40 disabled:hover:bg-primary disabled:text-white"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="cancel-button bg-error hover:opacity-60 py-2 px-4 text-white rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
          </form>
        </div>

        {showConfirmationModal && (
          <ConfirmationModal
            onConfirm={handleConfirmNavigation}
            onCancel={handleDismissNavigation}
          />
        )}
      </div>
    </>
  );
}
