import React, { useEffect, useState } from "react";
import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { useInventoryDescriptionForMaintenance } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionForMaintenance";
import { useAddOrUpdateInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionAddOrUpdate";
import { useDeleteInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionDelete";
import Pagination from "../../Pagination";
import SearchInput from "../../SearchBox";
import InvDescAddOverlay from "./InventoryDescriptionMaintenanceAddOverlay";
import { toast } from "react-toastify";
import TableHeader from "@/components/TableHeader";
import { AddOrUpdateInventoryDescriptionPayloadInterface } from "@/types/InventoryInterface";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

function InventoryDescriptionMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addbutton, setAddButton] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const itemsCategoryPage = 20;
  const [message, setMessage] = useState<string | null>(null);
  const [hasModelName, setHasModelName] = useState<boolean>(false);
  const [hasPartNumber, setHasPartNumber] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [hasExpiryDate, setHasExpiryDate] = useState<boolean>(true);
  const [hasBatchNumber, setHasBatchNumber] = useState<boolean>(true);

  const { mutate: addOrUpdateInventoryDescription } =
    useAddOrUpdateInventoryDescription();
  const { mutate: deleteInventoryDescription } =
    useDeleteInventoryDescription();

  const {
    data: inventoryDescriptionList,
    error: inventoryError,
    isLoading: inventoryLoading,
    refetch: refetchInventoryData,
  } = useInventoryDescriptionForMaintenance(authKey, {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    categoryId: selectedCategory,
    varsortby: sortBy,
    varsortorder: sortOrder,
  });

  const {
    data: categoryList,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategoryList(authKey || "", {
    page: 1,
    limit: itemsCategoryPage,
  });

  const totalCount = inventoryDescriptionList?.totalCount || 0;
  const data = inventoryDescriptionList?.data || [];
  const category = categoryList?.data || [];

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedValues, setEditedValues] =
    useState<AddOrUpdateInventoryDescriptionPayloadInterface>();

  if (inventoryLoading || categoriesLoading) return <div>Loading...</div>;
  if (inventoryError || categoriesError) return <div>Error loading data</div>;

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setHasModelName(categoryId === "specificCategoryID");

    const selectedCategoryData = data.find(
      (category: any) => category.Id === categoryId
    );
    if (selectedCategoryData) {
      setHasModelName(!!selectedCategoryData.ModelName);
      setHasPartNumber(!!selectedCategoryData.PartNumber);
    }
  };

  const handleEdit = (id: string) => {
    setEditingItem(id);
    const item = data.find((val) => val.Id === id);
    if (item) {
      setEditedValues({
        ...item,
        Description: item.Description || "",
        ShortName: item.ShortName || "",
        ModelName: item.ModelName || "",
        PartNumber: item.PartNumber || "",
        HasExpiryDate: item.HasExpiryDate ? item.HasExpiryDate : undefined,
        HasBatchNumber: item.HasBatchNumber ? item.HasBatchNumber : undefined,
      });
    }
  };

  const handleSave = async (id: string) => {
    if (!editedValues?.Description || !editedValues?.ShortName) {
      toast.error("Description and ShortName are required fields.", {
        position: "top-right",
      });
      return;
    }

    try {
      const payload: AddOrUpdateInventoryDescriptionPayloadInterface = {
        Id: editedValues?.Id,
        Description: editedValues?.Description,
        CategoryName: editedValues?.CategoryName,
        CategoryId: editedValues?.CategoryId,
        ShortName: editedValues?.ShortName,
        ManufacturerName: editedValues?.ManufacturerName,
        ManufacturerId: editedValues?.ManufacturerId,
        ModelName: editedValues?.ModelName,
        PartNumber: editedValues?.PartNumber,
        HasExpiryDate: editedValues?.HasExpiryDate,
        HasBatchNumber: editedValues?.HasBatchNumber,
      };

      await addOrUpdateInventoryDescription(payload, {
        onSuccess: () => {
          setEditingItem(null);
          setEditedValues({});
          refetchInventoryData();
          toast.success("Inventory Description updated successfully!", {
            position: "top-right",
          });
        },
        onError: (error) => {
          toast.error(
            `Error updating item: ${error.message || "Unknown error"}`,
            {
              position: "top-right",
            }
          );
        },
      });
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditedValues({});
  };

  const handleDelete = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-black">
            Are you sure you want to delete this Inventory?
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                deleteInventoryDescription(
                  { Id: id, AuthKey: authKey },
                  {
                    onSuccess: () => {
                      toast.success(
                        "Inventory Description deleted successfully!",
                        {
                          position: "top-right",
                        }
                      );
                      refetchInventoryData();
                      closeToast();
                    },
                    onError: (error) => {
                      toast.error(
                        `Error deleting item: ${
                          error.message || "Unknown error"
                        }`,
                        {
                          position: "top-right",
                        }
                      );
                      closeToast();
                    },
                  }
                );
              }}
              className="px-3 py-1.5 bg-error text-white rounded-md hover:bg-error"
            >
              Delete
            </button>
            {/* <button
              onClick={closeToast}
              className="px-3 py-1.5 bg-error text-white rounded-md hover:bg-error"
            >
              Cancel
            </button> */}
          </div>
        </div>
      ),
      {
        autoClose: false,
        position: "top-right",
        className: "bg-warning text-white",
      }
    );
  };

  const handleOverlayClose = () => {
    setAddButton(false);
    refetchInventoryData();
  };

  const handleSortChange = (column: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newSortOrder);
  };

  return (
    <>
      <TableHeader
        tableTitle="Inventory Description Maintenance"
        dataTitle="Inventory"
        button={true}
        hasModelName={hasModelName}
        hasPartNumber={hasPartNumber}
        handleSortChange={() => {}}
        sortby="manufacturer"
        sortorder="asc"
      />
      <div className="w-fit px-56">
        <div className="p-2 space-y-2">
          <div className="flex items-center md:flex-row gap-4 mt-[-50px]">
            <div className="flex-1">
              <label
                htmlFor="category-select"
                className="block text-gray-700 font-bold text-sm pl-2"
              ></label>
              <select
                id="category-select"
                onChange={(e) => handleSelectCategory(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-xl font-bold text-sm"
              >
                <option value="">All Categories</option>
                {category.map((category) => (
                  <option key={category.Id} value={category.Id}>
                    {category.Name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/2 mt-2 text-sm">
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full">
        <div className="py-1 flex justify-end mb-8">
          <button
            className="btn bg-success rounded-xl px-4 py-2 text-white flex items-center md:justify-around mb-6"
            type="button"
            onClick={() => setAddButton(!addbutton)}
          >
            Add
            <AddRounded />
          </button>
        </div>

        <div className="overflow-x-auto border-2 rounded-lg relative top-[-40px]">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-tablehead border-b-2 text-left">
                <th
                  className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                  onClick={() => handleSortChange("manufacturername")}
                >
                  Manufacturer
                  {sortBy === "manufacturername" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                  onClick={() => handleSortChange("category")}
                >
                  Category
                  {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer text-left border-b py-3 px-5 text-sm "
                  onClick={() => handleSortChange("description")}
                >
                  Description
                  {sortBy === "description" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>

                <th
                  className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                  onClick={() => handleSortChange("shortname")}
                >
                  Short Name
                  {sortBy === "shortname" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>

                {hasExpiryDate && (
                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("expiry")}
                  >
                    Expiry Date
                    {sortBy === "expiry" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                )}
                {hasBatchNumber && (
                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("batchnumber")}
                  >
                    Batch Number
                    {sortBy === "batchnumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                )}
                {hasModelName && (
                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("modelname")}
                  >
                    Model Name
                    {sortBy === "modelname" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                )}

                {hasPartNumber && (
                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("partnumber")}
                  >
                    Part Number
                    {sortBy === "partnumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                )}

                <th className="cursor-pointer  border-b  pl-3 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.Id}>
                  <td className="border-b py-3 px-5 truncate max-w-xs">
                    {item.ManufacturerName}
                  </td>

                  <td className="border-b py-3 px-5">{item.CategoryName}</td>

                  <td className="border-b py-3 px-5 truncate max-w-xs">
                    {editingItem === item.Id ? (
                      <input
                        type="text"
                        value={editedValues?.Description || ""}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            Description: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded-md"
                      />
                    ) : (
                      item.Description
                    )}
                  </td>

                  <td className="border-b py-3 px-5 truncate">
                    {editingItem === item.Id ? (
                      <input
                        type="text"
                        value={editedValues?.ShortName || ""}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            ShortName: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded-md"
                      />
                    ) : (
                      item.ShortName
                    )}
                  </td>

                  <td className="border-b py-3 px-5">
                    {editingItem === item.Id ? (
                      <div className="flex items-center space-x-4">
                        {/* <span
                          className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                            editedValues?.HasBatchNumber === "Yes"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></span> */}
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={!!editedValues?.HasExpiryDate}
                            onChange={() =>
                              setEditedValues((prevState) => ({
                                ...prevState,
                                HasExpiryDate: !prevState?.HasExpiryDate,
                              }))
                            }
                            className="toggle-checkbox hidden"
                          />
                          <span
                            className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                              editedValues?.HasExpiryDate
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                editedValues?.HasExpiryDate
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            ></span>
                          </span>
                        </label>
                        <span>
                          {editedValues?.HasExpiryDate ? "Yes" : "No"}
                        </span>
                      </div>
                    ) : (
                      <p>{item.HasExpiryDate ? "Yes" : "No"}</p>
                    )}
                  </td>
                  <td className="border-b py-3 px-5">
                    {editingItem === item.Id ? (
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={!!editedValues?.HasBatchNumber}
                            onChange={() =>
                              setEditedValues((prevState) => ({
                                ...prevState,
                                HasBatchNumber: !prevState?.HasBatchNumber,
                              }))
                            }
                            className="toggle-checkbox hidden"
                          />
                          <span
                            className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                              editedValues?.HasBatchNumber
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                editedValues?.HasBatchNumber
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            ></span>
                          </span>
                        </label>
                        <span>
                          {editedValues?.HasBatchNumber ? "Yes" : "No"}
                        </span>
                      </div>
                    ) : (
                      <span
                        onClick={() => setEditingItem(item.Id)}
                        className="cursor-pointer hover:underline"
                      >
                        {item.HasBatchNumber ? "Yes" : "No"}
                      </span>
                    )}
                  </td>

                  {hasModelName && (
                    <td className="border-b py-3 px-5 truncate">
                      {editingItem === item.Id ? (
                        <input
                          type="text"
                          value={editedValues?.ModelName || ""}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              ModelName: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border rounded-md"
                        />
                      ) : (
                        item.ModelName
                      )}
                    </td>
                  )}

                  {hasPartNumber && (
                    <td className="border-b py-3 px-5 truncate">
                      {editingItem === item.Id ? (
                        <input
                          type="text"
                          value={editedValues?.PartNumber || ""}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              PartNumber: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border rounded-md"
                        />
                      ) : (
                        item.PartNumber
                      )}
                    </td>
                  )}

                  <td className="border-b py-3 px-5">
                    {editingItem === item.Id ? (
                      <>
                        <button
                          onClick={() => handleSave(item.Id)}
                          className="mr-2 text-success border rounded-xl bg-success text-white px-4 py-2 hover:opacity-40"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-error border rounded-xl bg-error text-white px-4 py-2 hover:opacity-40"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(item.Id)}
                          className="mr-2 text-success"
                        >
                          <EditRounded />
                        </button>
                        <button
                          onClick={() => handleDelete(item.Id)}
                          className="text-error"
                        >
                          <DeleteRounded />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(
            (inventoryDescriptionList?.totalCount
              ? inventoryDescriptionList?.totalCount
              : 0) / itemsPerPage
          )}
          onPageChange={(page) => setCurrentPage(page)}
        />

        {addbutton && <InvDescAddOverlay onOverlayClose={handleOverlayClose} />}
      </div>
    </>
  );
}

export default InventoryDescriptionMaintenanceContainer;
