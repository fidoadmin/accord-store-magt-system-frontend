import React, { useState } from "react";
import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  SaveRounded,
} from "@mui/icons-material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { getCookie } from "cookies-next";
import SearchInput from "@/components/SearchBox";
import { useAddOrUpdateCategory } from "@/app/hooks/category/useCategoryAddOrUpdate";
import { useDeleteCategoryDetail } from "@/app/hooks/category/useCategoryDelete";
import { toast } from "react-toastify";
import { AddOrUpdateCategoryPayloadInterface } from "@/types/CategoryInterface";
import Pagination from "@/components/Pagination";
import InvDescAddOverlay from "./CategoriesMaintenanceAddOverlay";
function CategoriesMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [addbutton, setAddButton] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [categories, setCategories] = useState<any[]>([]);
  const [editableCategory, setEditableCategory] = useState<any | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const { mutate: addOrUpdateCategory } = useAddOrUpdateCategory();
  const { mutate: deleteCategoryDetails } = useDeleteCategoryDetail();

  const {
    data: categoryList,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategoryList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    varsortby: sortBy,
    varsortorder: sortOrder,
  });

  const handleEditCategory = (categoryId: string, category: any) => {
    setEditingCategoryId(categoryId);
    setEditableCategory({ ...category });
  };

  const handleSaveCategory = async () => {
    if (editableCategory) {
      const payload: AddOrUpdateCategoryPayloadInterface = {
        Id: editingCategoryId || "",
        Name: editableCategory?.Name,
        HasManufactureDate: editableCategory?.HasManufactureDate,
        HasExpirationDate: editableCategory?.HasExpirationDate,
        HasModelName: editableCategory?.HasModelName,
        HasPartNumber: editableCategory?.HasPartNumber,
        ShowSize: editableCategory?.ShowSize,
        AllowExpiredInventory: editableCategory?.AllowExpiredInventory,
      };

      setCategories((prevUsers) =>
        prevUsers.map((category) =>
          category.Id === editingCategoryId
            ? { ...categories, ...editableCategory }
            : categories
        )
      );

      try {
        await addOrUpdateCategory(payload);
        setEditingCategoryId(null);
        setEditableCategory(null);
        setSortBy("modified");
        setSortOrder("desc");
        toast.success("Category details updated successfully!");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error updating category: ${error.message}`);
        } else {
          toast.error("Unknown error updating category.");
        }
      }
    }
  };

  const handleDelete = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">
          Are you sure you want to delete this category?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteCategoryDetails({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setCategories((prevCategories) =>
                  prevCategories.filter((category) => category.Id !== id)
                );

                toast.success("Category deleted successfully!");
                closeToast();
              } catch (error: any) {
                toast.error("Failed to delete user", { position: "top-right" });
                closeToast();
              }
            }}
            className="px-3 py-1.5 bg-error text-white rounded-md hover:bg-error"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const handleSortChange = (column: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newSortOrder);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditableCategory(null);
  };

  return (
    <>
      <div className="w-full px-8 mt-4">
        <h1 className="text-2xl font-bold mb-4"></h1>

        <div className="flex items-center gap-4 mt-[-56px] pl-48">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="flex justify-end mb-4">
          <button
            className="flex items-center px-4 py-2 bg-success text-white rounded-xl hover:opacity-80"
            onClick={() => setAddButton(true)}
          >
            <AddRounded className="mr-2" />
            ADD
          </button>
        </div>

        <div className="overflow-x-auto border-2 rounded-lg mt-2">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-tablehead border text-left">
                <th
                  className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                  onClick={() => handleSortChange("categoryname")}
                >
                  Category Name{" "}
                  {sortBy === "categoryname" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>

                <th
                  className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                  onClick={() => handleSortChange("created")}
                >
                  Created
                  {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                  onClick={() => handleSortChange("modified")}
                >
                  Modified
                  {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="cursor-pointer text-left border-b py-3 px-5 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categoriesLoading && (
                <tr>
                  <td colSpan={13} className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              )}
              {categoriesError && (
                <tr>
                  <td colSpan={13} className="p-4 text-center text-red-500">
                    Error loading categories.
                  </td>
                </tr>
              )}
              {categoryList && categoryList.data.length > 0
                ? categoryList.data.map((category) => (
                    <tr className="border hover:bg-gray-50" key={category.Id}>
                      <td className="p-4">
                        {editingCategoryId === category.Id ? (
                          <input
                            type="text"
                            value={editableCategory?.Name || ""}
                            onChange={(e) =>
                              setEditableCategory((prev: any) => ({
                                ...prev!,
                                Name: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          category.Name
                        )}
                      </td>

                      <td className="p-1">{category.Created}</td>
                      <td className="p-1">{category.Modified}</td>
                      <td className="p-4 flex gap-2">
                        {editingCategoryId === category.Id ? (
                          <>
                            <button
                              onClick={handleSaveCategory}
                              className="my-1 text-success"
                            >
                              <SaveRounded />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="my-1 text-error"
                            >
                              <CancelRounded />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                handleEditCategory(category.Id, category)
                              }
                              className="text-success hover:underline"
                            >
                              <EditRoundedIcon />
                            </button>
                            <button
                              onClick={() => handleDelete(category.Id)}
                              className="text-error hover:underline"
                            >
                              <DeleteRounded />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                : !categoriesLoading && (
                    <tr>
                      <td colSpan={13} className="p-4 text-center">
                        No categories found.
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(
          (categoryList?.totalCount ? categoryList?.totalCount : 0) /
            itemsPerPage
        )}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {addbutton && (
        <InvDescAddOverlay onOverlayClose={() => setAddButton(false)} />
      )}
    </>
  );
}

export default CategoriesMaintenanceContainer;
