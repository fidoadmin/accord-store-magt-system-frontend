import { toast } from "react-toastify";
import { FormEvent, useState } from "react";
import { getCookie } from "cookies-next";
import { AddOrUpdateInventoryDescriptionPayloadInterface } from "@/types/InventoryInterface";
import { useCompanyList } from "@/app/hooks/companies/useCompanyList";
import Dropdown from "@/components/Dropdown";
import { useAddOrUpdateInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionAddOrUpdate";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { CancelRounded, SaveRounded } from "@mui/icons-material";

const InvDescAddOverlay = ({
  onOverlayClose,
}: {
  onOverlayClose: () => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [hasModelName, setHasModelName] = useState<boolean>(false);
  const [hasPartNumber, setHasPartNumber] = useState<boolean>(false);
  const [hasExpiryDate, setHasExpiryDate] = useState<boolean>(false);
  const [hasBatchNumber, setHasBatchNumber] = useState<boolean>(false);

  const itemsPerPage = 20;
  const [category, setCategory] = useState<{ name?: string; id?: string }>({});

  const addOrUpdateInventoryDescription = useAddOrUpdateInventoryDescription();

  const initialInventoryData = {
    Id: "",
    Description: "",
    CategoryName: "",
    CategoryId: "",
    ShortName: "",
    ManufacturerName: "",
    ManufacturerId: "",
    ModelName: "",
    PartNumber: "",
    HasExpiryDate: false,
    HasBatchNumber: false,
  };

  const [descAddData, setDescAddData] =
    useState<AddOrUpdateInventoryDescriptionPayloadInterface>(
      initialInventoryData
    );

  useState(() => {
    const key = getCookie("authKey") as "";
    setAuthKey(key);
  });

  const { data: companyList } = useCompanyList(authKey || "", {
    ismanufacturer: "true",
  });

  const {
    data: categoryList,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategoryList(authKey || "", {
    page: 1,
    limit: itemsPerPage,
    categoryId: category?.id || "",
  });

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleChange = (e: any) => {
    setDescAddData({ ...descAddData, [e.target.name]: e.target.value });
  };

  const handleSelectCategory = (option: {
    id: string;
    name: string;
    hasModelName?: boolean;
    hasPartNumber?: boolean;
  }) => {
    setDescAddData({
      ...descAddData,
      CategoryId: option.id,
      CategoryName: option.name,
    });
    setHasModelName(option.hasModelName!);
    setHasPartNumber(option.hasPartNumber!);
  };

  const handleSelectManufacturer = (option: { id: string; name: string }) => {
    setDescAddData({
      ...descAddData,
      ManufacturerId: option.id,
      ManufacturerName: option.name,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!descAddData.ManufacturerId) {
      toast.error("Manufacturer is required.", { position: "top-right" });
      return;
    }

    if (!descAddData.Description) {
      toast.error("Description is required.", { position: "top-right" });
      return;
    }

    try {
      await addOrUpdateInventoryDescription.mutateAsync({
        ...descAddData,
        HasExpiryDate: hasExpiryDate,
      });
      toast.success("Inventory Description saved successfully!", {
        position: "top-right",
      });
      onOverlayClose();
    } catch (error) {
      console.error("Operation Failed", error);
      toast.error("Failed to save Inventory Description.", {
        position: "top-right",
      });
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20"
        onClick={onOverlayClose}
      />
      <div className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-surface border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto">
        <div className="titleDiv">
          <h1 className="text-lg text-primary text-center font-bold">
            Add an Inventory Description
          </h1>
        </div>
        <div className="h-full w-full">
          <Dropdown
            placeholder="Select a Category"
            label="Category"
            showLabel
            options={
              categoryList?.data.map((category) => ({
                id: category.Id,
                name: category.Name,
                hasModelName: category.HasModelName,
                hasPartNumber: category.HasPartNumber,
              })) ?? []
            }
            onSelect={handleSelectCategory}
            isOpen={openDropdown === "category"}
            setIsOpen={() => handleSetOpenDropdown("category")}
            search={true}
          />
        </div>

        {descAddData?.CategoryId?.length! ? (
          <>
            <div className="flex-1 form-div h-full w-full">
              <p className="text-text text-sm">
                Manufacture: <span className="text-error">*</span>
              </p>
              <Dropdown
                showLabel
                placeholder="Select a Manufacturer"
                options={
                  companyList?.data.map((manufacturer) => ({
                    id: manufacturer.Id,
                    name: manufacturer.Name,
                  })) ?? []
                }
                onSelect={handleSelectManufacturer}
                isOpen={openDropdown === "manufacturer"}
                setIsOpen={() => handleSetOpenDropdown("manufacturer")}
                search={true}
              />

              <div>
                <p className="text-text text-sm">
                  Description: <span className="text-error">*</span>
                </p>
                <input
                  name="Description"
                  value={descAddData.Description || ""}
                  className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
                  onChange={handleChange}
                />
              </div>
              <div>
                <p className="text-text text-sm"> Short Name:</p>
                <input
                  name="ShortName"
                  value={descAddData.ShortName || ""}
                  className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
                  onChange={handleChange}
                />
              </div>

              {hasModelName && (
                <div className="w-full">
                  <p className="text-text text-sm">Model Name:</p>
                  <input
                    name="ModelName"
                    value={descAddData.ModelName || ""}
                    className="inner-border-2 inner-border-primary rounded-xl w-full p-2"
                    onChange={handleChange}
                  />
                </div>
              )}
              {hasPartNumber && (
                <div className="w-full">
                  <p className="text-text text-sm">Part Number:</p>
                  <input
                    name="PartNumber"
                    value={descAddData.PartNumber || ""}
                    className="inner-border-2 inner-border-primary rounded-xl w-full p-2"
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-fit px-4 py-2 mt-2 bg-white text-black">
                <label className="flex items-center">
                  <p className="text-sm">Expiry Date: </p>
                  <input
                    type="checkbox"
                    checked={hasExpiryDate}
                    onChange={() => setHasExpiryDate(!hasExpiryDate)}
                    className="toggle-checkbox hidden"
                  />
                  <span
                    className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                      hasExpiryDate ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                        hasExpiryDate ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </span>
                </label>
                <span>{hasExpiryDate ? "Yes" : "No"}</span>
              </div>

              <div className="flex items-center space-x-4 border-2 border-primary rounded-xl w-fit px-4 py-2 mt-2 bg-white text-black">
                <label className="flex items-center">
                  <p className="text-sm">Batch Number: </p>
                  <input
                    type="checkbox"
                    checked={hasBatchNumber}
                    onChange={() => setHasBatchNumber(!hasBatchNumber)}
                    className="toggle-checkbox hidden"
                  />
                  <span
                    className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                      hasBatchNumber ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                        hasBatchNumber ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </span>
                </label>
                <span>{hasBatchNumber ? "Yes" : "No"}</span>
              </div>
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
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default InvDescAddOverlay;
