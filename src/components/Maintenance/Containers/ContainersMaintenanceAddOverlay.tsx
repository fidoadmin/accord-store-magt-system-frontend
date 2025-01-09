import { useState, FormEvent } from "react";
import { useAddOrUpdateContainer } from "@/app/hooks/Container/useContainerAddOrUpdate";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { useContainers } from "@/app/hooks/containers/useContainerList";
import Dropdown from "@/components/Dropdown";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";
import { AddOrUpdateContainerPayloadInterface } from "@/types/ContainerInterface";

const ContainerAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: () => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [descAddData, setDescAddData] =
    useState<AddOrUpdateContainerPayloadInterface>({
      Id: "",
      NumberOfUnits: undefined,
      Size: "",
      CategoryId: "",
      Type: "",
      SmallUnit: "",
    });
  const itemsPerPage = 20;

  const { mutate: addOrUpdateContainer } = useAddOrUpdateContainer();

  const { data: containerList = [] } =
    useContainers(authKey || "", {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      categoryId: selectedCategory,
    }) || {};

  const {
    data: categoryList = [],
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategoryList(authKey || "", {
    page: 1,
    limit: itemsPerPage,
  });

  const categories = Array.isArray(categoryList)
    ? categoryList
    : categoryList?.data || [];

  const handleSelectCategory = (option: {
    id: string;
    name: string;
    isExpiry?: boolean;
  }) => {
    setSelectedCategory(option.id);
    setDescAddData((prev) => ({
      ...prev,
      CategoryId: option.id,
    }));
  };

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "NumberOfUnits") {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }
    setDescAddData({
      ...descAddData,
      [name]: name === "NumberOfUnits" ? value : value.toUpperCase(),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!descAddData.Type) {
      toast.error("Type is required.", { position: "top-right" });
      return;
    }
    if (!descAddData.CategoryId) {
      toast.error("Category is required.", { position: "top-right" });
      return;
    }
    if (!descAddData.NumberOfUnits) {
      toast.error("Number of Units is required.", { position: "top-right" });
      return;
    }

    if (!descAddData.SmallUnit) {
      toast.error("Small Unit is required.", { position: "top-right" });
      return;
    }

    try {
      const response = await addOrUpdateContainer(descAddData);
      onSuccess();
      onOverlayClose();
    } catch (error) {
      toast.error("An error occurred while saving the container.", {
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
        className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-surface border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <h1 className="text-lg text-primary text-center font-bold">
          Add Container
        </h1>
        <Dropdown
          label="Category"
          options={
            categories.map((category) => ({
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
        <div>
          <label>
            Type
            <span className="text-error">*</span>
          </label>
          <input
            name="Type"
            value={descAddData.Type}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            Number of Units
            <span className="text-error">*</span>
          </label>
          <input
            name="NumberOfUnits"
            value={descAddData.NumberOfUnits}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Size</label>
          <input
            name="Size"
            value={descAddData.Size}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            Small Unit
            <span className="text-error">*</span>
          </label>
          <input
            name="SmallUnit"
            value={descAddData.SmallUnit}
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

export default ContainerAddOverlay;
