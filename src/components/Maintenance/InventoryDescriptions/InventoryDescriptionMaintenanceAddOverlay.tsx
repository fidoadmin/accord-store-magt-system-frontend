import { toast } from "react-toastify";
import { FormEvent, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { AddOrUpdateInventoryDescriptionPayloadInterface } from "@/types/InventoryInterface";
import { useAddOrUpdateInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionAddOrUpdate";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { CancelRounded, SaveRounded } from "@mui/icons-material";
import { useDropdownList } from "@/app/hooks/globaldropdown/useGlobalDropdown";
import Dropdown from "@/components/Dropdown";

const InvDescAddOverlay = ({
  onOverlayClose,
}: {
  onOverlayClose: () => void;
}) => {
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hasModelName, setHasModelName] = useState<boolean>(false);
  const [hasExpiryDate, setHasExpiryDate] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");

  const itemsPerPage = 20;

  const addOrUpdateInventoryDescription = useAddOrUpdateInventoryDescription();

  const initialInventoryData = {
    Id: "",
    Description: "",
    CategoryName: "",
    CategoryId: "",
    ShortName: "",
    ModelName: "",
  };

  const [descAddData, setDescAddData] =
    useState<AddOrUpdateInventoryDescriptionPayloadInterface>(
      initialInventoryData
    );

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    const key = getCookie("authKey") as "";
    setAuthKey(key);
  }, []);
  const {
    data: categoryList,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useDropdownList("categories", search, filters);
  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleChange = (e: any) => {
    setDescAddData({ ...descAddData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
    console.log(option);
    setHasModelName(option.hasModelName!);
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
              categoryList?.map((category) => ({
                id: category.Id,
                name: category.Name,
              })) ?? []
            }
            onSelect={handleSelectCategory}
            isOpen={openDropdown === "category"}
            setIsOpen={() => handleSetOpenDropdown("category")}
            search={true}
          />
        </div>

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

        <div className="w-full">
          <p className="text-text text-sm">Model Name:</p>
          <input
            name="ModelName"
            value={descAddData.ModelName || ""}
            className="inner-border-2 inner-border-primary rounded-xl w-full p-2"
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
    </>
  );
};

export default InvDescAddOverlay;
