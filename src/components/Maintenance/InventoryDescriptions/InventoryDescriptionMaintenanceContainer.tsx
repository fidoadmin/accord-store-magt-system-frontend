import React, { useEffect, useState } from "react";
import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  EditRounded,
  SaveRounded,
} from "@mui/icons-material";
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

  const [sortBy, setSortBy] = useState<string>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);

  const { mutate: addOrUpdateInventoryDescription } =
    useAddOrUpdateInventoryDescription();
  const { mutate: deleteInventoryDescription } =
    useDeleteInventoryDescription();

  const {
    data: inventoryDescriptionList,
    error: inventoryError,
    isLoading: inventoryLoading,
    refetch: refetchInventoryData,
  } = useInventoryDescriptionForMaintenance(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    categoryId: selectedCategory,
    varsortby: sortBy,
    varsortorder: sortOrder,
  });

  const totalCount = inventoryDescriptionList?.totalCount || 0;
  const data = inventoryDescriptionList?.data || [];

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  console.log(totalPages);

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedValues, setEditedValues] =
    useState<AddOrUpdateInventoryDescriptionPayloadInterface>();

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setHasModelName(categoryId === "specificCategoryID");

    const selectedCategoryData = data.find(
      (category: any) => category.Id === categoryId
    );
    if (selectedCategoryData) {
      setHasModelName(!!selectedCategoryData.ModelName);
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
        ShortName: editedValues?.ShortName,
        ModelName: editedValues?.ModelName,
      };

      await addOrUpdateInventoryDescription(payload, {
        onSuccess: () => {
          setEditingItem(null);
          setEditedValues({});
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
            <div className="w-full  mt-1.5 text-sm">
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

        <div className="border-2 rounded-lg relative top-[-40px]">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-tablehead border-b-2 text-left">
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

                <th
                  className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                  onClick={() => handleSortChange("modelname")}
                >
                  Model Name
                  {sortBy === "modelname" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSortChange("created")}
                >
                  Created{" "}
                  {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-4 cursor-pointer"
                  onClick={() => handleSortChange("modified")}
                >
                  Modified{" "}
                  {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="cursor-pointer  border-b  pl-3 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.Id}>
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

                  <td className="border-b py-3 px-5">
                    {item.Created || "N/A"}
                  </td>
                  <td className="border-b py-3 px-5">
                    {item.Modified || "N/A"}
                  </td>

                  <td className="border-b py-3 px-5">
                    {editingItem === item.Id ? (
                      <>
                        <button
                          onClick={() => handleSave(item.Id)}
                          className="mr-2 text-success"
                        >
                          <SaveRounded />
                        </button>
                        <button onClick={handleCancel} className="text-error">
                          <CancelRounded />
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
