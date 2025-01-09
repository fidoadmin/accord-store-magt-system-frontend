import { toast } from "react-toastify";
import { FormEvent, useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { SaveRounded, CancelRounded } from "@mui/icons-material";
import { useAddOrUpdateCategory } from "@/app/hooks/category/useCategoryAddOrUpdate";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { AddOrUpdateCategoryPayloadInterface } from "@/types/CategoryInterface";

const InvDescAddOverlay = ({
  onOverlayClose,
}: {
  onOverlayClose: () => void;
}) => {
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [hasExpiryDate, setHasExpiryDate] = useState<boolean>(false);

  const [descAddData, setDescAddData] =
    useState<AddOrUpdateCategoryPayloadInterface>({
      Id: "",
      Name: "",
      HasExpirationDate: false,
      HasManufactureDate: false,
      HasModelName: false,
      HasPartNumber: false,
      ShowSize: false,
      AllowExpiredInventory: false,
    });

  const addOrUpdateCategory = useAddOrUpdateCategory();

  useEffect(() => {
    const key = getCookie("authKey") as string;
    setAuthKey(key || "");
  }, []);

  const {
    data: categoryList,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategoryList(authKey || "", {
    page: 1,
    limit: 20,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDescAddData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!descAddData.Name) {
      toast.error("Category name is required.", { position: "top-right" });
      return;
    }

    try {
      await addOrUpdateCategory.mutateAsync({
        ...descAddData,
        HasExpirationDate: hasExpiryDate,
      });
      toast.success("Category saved successfully!", {
        position: "top-right",
      });
      onOverlayClose();
    } catch (error: any) {
      console.error("Operation Failed", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save category.";
      toast.error(errorMessage, { position: "top-right" });
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  console.log;

  return (
    <>
      <div
        className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20"
        onClick={onOverlayClose}
      />

      <div
        className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-surface border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <div className="titleDiv">
          <h1 className="text-lg text-primary text-center font-bold">
            Add a Category
          </h1>
        </div>

        <div className="mb-4">
          <label className="text-sm text-text">Category Name:</label>
          <input
            name="Name"
            value={descAddData.Name || ""}
            className="w-full border-2 border-primary rounded-xl p-2"
            onChange={handleChange}
            placeholder="Enter category name"
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
