import React, { useEffect, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { AddRounded, DeleteRounded } from "@mui/icons-material";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import { useContainersForMaintenance } from "@/app/hooks/containers/useContainerListForMaintenance";
import Pagination from "../../Pagination";
import SearchInput from "@/components/SearchBox";
import { getCookie } from "cookies-next";
import ContainerAddOverlay from "./ContainersMaintenanceAddOverlay";
import Dropdown from "@/components/Dropdown";
import { useDeleteContainer } from "@/app/hooks/Container/useContainerDelete";
import { useAddOrUpdateContainer } from "@/app/hooks/Container/useContainerAddOrUpdate";
import { toast } from "react-toastify";
export default function ContainersMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;
  const [selectedContainer, setSelectedContainer] = useState<{
    name?: string;
    id?: string;
  } | null>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string | null>("Categories");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { mutate: addOrUpdateContainer } = useAddOrUpdateContainer();
  const [sortBy, setSortBy] = useState<string>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addButton, setAddButton] = useState<boolean>(false);
  const [formError, setFormError] = useState<string[] | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const itemsPerPage = 10;
  const [editableData, setEditableData] = useState<{
    Size: string | undefined;
    NumberOfUnits: number | undefined;
    SmallUnit: string | undefined;
  }>();
  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };
  const { data: containerList } =
    useContainersForMaintenance(authKey || "", {
      page: currentPage,
      limit: 6,
      search: searchTerm,
      categoryId: selectedCategory,
      sortBy: sortBy,
      sortOrder: sortOrder,
      type: selectedContainer?.name,
    }) || {};
  const {
    data: categoryList = [],
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategoryList(authKey || "", {
    page: 1,
  });
  const categories = Array.isArray(categoryList)
    ? categoryList
    : categoryList?.data || [];
  const handleSelectContainer = (option: { id: string; name: string }) => {
    setSelectedContainer(option);
    setEditingIndex(null);
  };
  const handleSelectCategory = (option: {
    id: string;
    name: string;
    isExpiry?: boolean;
  }) => {
    setSelectedCategory(option.id);
    setCategoryName(option.name);
    setEditingIndex(null);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);
  const handleOverlayClose = () => {
    setAddButton(false);
  };
  const handelSuccess = async () => {
    setSortBy("created");
    setSortOrder("desc");
    setSelectedCategory("");
    handleSelectCategory({ id: "", name: "" });
    setSelectedContainer(null);
    setOpenDropdown(null);
    setCategoryName(null);
  };
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const handleEditClick = (pack: any) => {
    setEditingIndex(pack.ContainerId);
    setEditableData({
      NumberOfUnits: pack.NumberOfUnits ? pack.NumberOfUnits : undefined,
      Size: pack.Size,
      SmallUnit: pack.SmallUnit,
    });
  };
  const handleSave = async () => {
    if (editingIndex === null) {
      console.error("Editing index is null, cannot save.");
      return;
    }
    try {
      await addOrUpdateContainer({
        Id: editingIndex,
        Size: editableData?.Size || "",
        NumberOfUnits: editableData?.NumberOfUnits || undefined,
        SmallUnit: editableData?.SmallUnit,
      });
      setOpenDropdown(null);
      setSortBy("modified");
      setSortOrder("desc");
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving container:", error);
    }
  };
  const handleCancel = () => {
    setEditingIndex(null);
  };
  const { mutate: deleteContainer } = useDeleteContainer();
  const handleDelete = async (containerId: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">Are you sure you want to delete this item?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              deleteContainer({ Id: containerId, AuthKey: authKey });
            }}
            className="px-3 py-1.5 bg-error text-white rounded-md hover:bg-error"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };
  return (
    <>
      <div className="w-fit px-56">
        <div className="p-2 space-y-2">
          <div className="flex items-center md:flex-row gap-4 mt-[-50px]">
            <div className="flex-1">
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
                value={categoryName ? categoryName : "Categories"}
              />
            </div>
            <div className="w-40 mt-1">
              <Dropdown
                label="Container"
                options={
                  containerList?.data
                    .filter(
                      (value, index, self) =>
                        index === self.findIndex((t) => t.Type === value.Type)
                    )
                    .map((container: any) => ({
                      id: container.Type,
                      name: container.Type,
                    })) ?? []
                }
                required
                isOpen={openDropdown === "container"}
                setIsOpen={() => handleSetOpenDropdown("container")}
                onSelect={handleSelectContainer}
                value={selectedContainer?.name || "Type"}
                placeholder="Type"
                error={
                  formError?.includes("Container") && !selectedContainer?.name
                }
              />
              {formError?.includes("Container") && !selectedContainer?.name && (
                <p className="text-xs text-error">Please select a container</p>
              )}
            </div>
            <div className="w-full md:w-1/2 mt-1 text-sm">
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center px-4 py-2 bg-success text-white rounded-xl hover:opacity-80"
          onClick={() => setAddButton(true)}
        >
          <AddRounded className="mr-2" /> ADD
        </button>
      </div>
      <div className="relative w-full overflow-x-auto border-2 rounded-lg">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-tablehead border-b-2 text-left">
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("type")}
              >
                Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("numberofunits")}
              >
                Number of Units{" "}
                {sortBy === "numberofunits" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("size")}
              >
                Size {sortBy === "size" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("smallunit")}
              >
                Small Unit{" "}
                {sortBy === "smallunit" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("created")}
              >
                Created{" "}
                {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("modified")}
              >
                Modified{" "}
                {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(containerList?.data.length ? containerList?.data.length : 0) >
            0 ? (
              containerList?.data.map((container) => (
                <tr key={container.Id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{container.Type || "N/A"}</td>
                  <td className="p-4">
                    {editingIndex === container.ContainerId ? (
                      <input
                        type="number"
                        value={
                          editableData?.NumberOfUnits !== undefined
                            ? editableData.NumberOfUnits.toString()
                            : ""
                        }
                        onChange={(e) =>
                          setEditableData({
                            Size: editableData?.Size || "",
                            SmallUnit: editableData?.SmallUnit || "",
                            NumberOfUnits: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          })
                        }
                      />
                    ) : (
                      container.NumberOfUnits || "N/A"
                    )}
                  </td>
                  <td className="p-4">
                    {editingIndex === container.ContainerId ? (
                      <input
                        type="text"
                        value={editableData?.Size || ""}
                        onChange={(e) =>
                          setEditableData({
                            Size: e.target.value.toUpperCase(),
                            NumberOfUnits:
                              editableData?.NumberOfUnits || undefined,
                            SmallUnit: editableData?.SmallUnit || "",
                          })
                        }
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      container.Size
                    )}
                  </td>
                  <td className="p-4">
                    {editingIndex === container.ContainerId ? (
                      <input
                        type="text"
                        value={editableData?.SmallUnit || ""}
                        onChange={(e) =>
                          setEditableData({
                            Size: editableData?.Size || "",
                            NumberOfUnits:
                              editableData?.NumberOfUnits || undefined,
                            SmallUnit: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      container.SmallUnit
                    )}
                  </td>
                  <td className="p-4">{container.Created || "N/A"}</td>
                  <td className="p-4">{container.Modified || "N/A"}</td>
                  <td className="p-4 flex gap-2">
                    {editingIndex === container.ContainerId ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="border rounded-xl px-4 py-2 bg-success text-white hover:opacity-80"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="border rounded-xl px-4 py-2 bg-error text-white hover:opacity-80"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <EditRoundedIcon
                          style={{ color: "green" }}
                          onClick={() => handleEditClick(container)}
                        />
                        <DeleteRounded
                          style={{ color: "red" }}
                          onClick={() => handleDelete(container.ContainerId)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No containers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {(containerList?.data.length ? containerList?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(
            (containerList?.totalCount || 0) / itemsPerPage
          )}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
      {addButton && (
        <ContainerAddOverlay
          onOverlayClose={handleOverlayClose}
          onSuccess={handelSuccess}
        />
      )}
    </>
  );
}
