import React, { useState } from "react";
import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";
import { useBranchGetList } from "@/app/hooks/branches/useBranchGetList";
import SearchInput from "@/components/SearchBox";
import {
  AddOrUpdateBranchPayloadInterface,
  BranchGetDetailInterface,
} from "@/types/BranchInterface";
import Pagination from "@/components/Pagination";
import BranchesMaintenanceAddOverlay from "./BranchesMaintenanceAddOverlay";
import { toast } from "react-toastify";
import { useDeleteBranchDetail } from "@/app/hooks/branch/useBranchDelete";
import { useAddOrUpdateBranch } from "@/app/hooks/branch/useBranchAddOrUpdate";

function BranchesMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;
  const [company, setCompany] = useState<{ name?: string; id?: string }>({});
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [addButton, setAddButton] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [editableBranch, setEditableBranch] =
    useState<BranchGetDetailInterface | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [branches, setBranches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 10;

  const { mutate: deleteBranchDetails } = useDeleteBranchDetail();
  const { mutate: addOrUpdateBranch } = useAddOrUpdateBranch();
  const {
    data: branchData,
    error: branchError,
    isLoading: branchLoading,
  } = useBranchGetList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  const totalCount = branchData?.totalCount || 0;
  const data = branchData?.data || [];

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleSelectBranch = (id: string) => {
    setSelectedBranchId(id);
  };

  const clearSelectedBranch = () => {
    setSelectedBranchId(null);
  };

  const handleEditBranch = (id: string, branch: any) => {
    setEditingBranchId(id);
    setEditableBranch({ ...branch });
  };

  const handleSaveBranch = async () => {
    if (editableBranch) {
      const payload: AddOrUpdateBranchPayloadInterface = {
        Id: editingBranchId || "",
        Name: editableBranch?.Name,
        Address: editableBranch?.Address,
        EmailAddress: editableBranch?.EmailAddress,
        PhoneNumber: editableBranch?.PhoneNumber,
        IsEntryPoint: editableBranch?.IsEntryPoint,
      };
      try {
        if (!editableBranch.EmailAddress || !editableBranch.PhoneNumber) {
          toast.error("Email Address and Phone Number cannot be empty.");
          return;
        }

        await addOrUpdateBranch(payload);

        setEditingBranchId(null);
        setEditableBranch(null);
        setSortBy("modified");
        setSortOrder("desc");
        toast.success("Branch updated successfully!");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error updating branch: ${error.message}`);
        } else {
          toast.error("Unknown error updating branch");
        }
      }
    }
  };
  const handleDeleteBranch = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">
          Are you sure you want to delete this branch?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteBranchDetails({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setBranches((prevBranch) =>
                  prevBranch.filter((branch) => branch.Id !== id)
                );

                // toast.success("Branch deleted successfully!");
                closeToast();
              } catch (error: any) {
                toast.error("Failed to delete branch", {
                  position: "top-right",
                });
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
  const handleCancelBranch = () => {
    setEditingBranchId(null);
    setEditableBranch(null);
  };

  const handleOverlayClose = () => {
    setAddButton(false);
  };

  if (branchLoading) return <div>Loading...</div>;
  if (branchError) return <div>Error loading data</div>;

  const handelSuccess = async (newBranch: any) => {
    if (newBranch) {
      setBranches((prevBranches) => [newBranch, ...prevBranches]);
    }
  };
  return (
    <>
      <div className="w-full px-8 mt-4">
        <div className="flex items-center gap-4 mt-[-56px] pl-48">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="relative w-full">
          <div className="py-1 flex justify-end mb-2">
            <button
              className="btn bg-success rounded-xl px-4 py-2 text-white flex items-center"
              onClick={() => setAddButton(!addButton)}
            >
              Add
              <AddRounded />
            </button>
          </div>

          <div className="overflow-x-auto overflow-y-auto border-2 rounded-lg relative top-[-5px]">
            <table className="w-full border-collapse table-auto bo">
              <thead>
                <tr className="bg-tablehead border-b-2 text-left">
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("name")}
                  >
                    Name{" "}
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("address")}
                  >
                    Address{" "}
                    {sortBy === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("emailaddress")}
                  >
                    EmailAddress{" "}
                    {sortBy === "emailaddress" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("phonenumber")}
                  >
                    PhoneNumber{" "}
                    {sortBy === "phonenumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("entrypoint")}
                  >
                    Entry Point
                    {sortBy === "entrypoint" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("created")}
                  >
                    Created{" "}
                    {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("modified")}
                  >
                    Modified{" "}
                    {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="py-3 px-5">Actions</th>
                </tr>
              </thead>

              {branchLoading ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center">
                    Loading branches...
                  </td>
                </tr>
              ) : branchError ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center">
                    Error loading branches: {branchError}
                  </td>
                </tr>
              ) : branchData?.data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center">
                    No branches found.
                  </td>
                </tr>
              ) : (
                branchData?.data.map((branch) => (
                  <tr
                    className={`border-b hover:bg-gray-100 ${
                      branch.Id === selectedBranchId ? "bg-blue-100" : ""
                    }`}
                    key={branch.Id}
                  >
                    <td className="py-3 px-5">
                      {editingBranchId === branch.Id ? (
                        <input
                          type="text"
                          value={editableBranch?.Name || ""}
                          onChange={(e) =>
                            setEditableBranch((prev) => ({
                              ...prev!,
                              Name: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                      ) : (
                        branch.Name
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {editingBranchId === branch.Id ? (
                        <input
                          type="text"
                          value={editableBranch?.Address || ""}
                          onChange={(e) =>
                            setEditableBranch((prev) => ({
                              ...prev!,
                              Address: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                      ) : (
                        branch.Address
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {editingBranchId === branch.Id ? (
                        <input
                          type="text"
                          value={editableBranch?.EmailAddress || ""}
                          onChange={(e) =>
                            setEditableBranch((prev) => ({
                              ...prev!,
                              EmailAddress: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                      ) : (
                        branch.EmailAddress
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {editingBranchId === branch.Id ? (
                        <input
                          type="text"
                          value={editableBranch?.PhoneNumber || ""}
                          onChange={(e) =>
                            setEditableBranch((prev) => ({
                              ...prev!,
                              PhoneNumber: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                      ) : (
                        branch.PhoneNumber
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {editingBranchId === branch.Id ? (
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={!!editableBranch?.IsEntryPoint || false}
                            onChange={(e) =>
                              setEditableBranch((prev) => ({
                                ...prev!,
                                IsEntryPoint: e.target.checked,
                              }))
                            }
                            className="toggle-checkbox hidden"
                          />
                          <span
                            className={`toggle-switch w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                              editableBranch?.IsEntryPoint
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform ${
                                editableBranch?.IsEntryPoint
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            ></span>
                          </span>
                          <span>
                            {editableBranch?.IsEntryPoint ? "Yes" : "No"}
                          </span>
                        </label>
                      ) : (
                        <span
                          onClick={() => setEditableBranch(branch)}
                          className="cursor-pointer hover:underline"
                        >
                          <td>{branch.IsEntryPoint === true ? "Yes" : "No"}</td>
                        </span>
                      )}
                    </td>

                    <td className="p-4">{branch.Created}</td>
                    <td className="p-4">{branch.Modified}</td>
                    <td className="p-4 flex gap-2">
                      {editingBranchId === branch.Id ? (
                        <>
                          <button
                            onClick={handleSaveBranch}
                            className="border rounded-xl px-4 py-2 bg-success text-white hover:opacity-80"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelBranch}
                            className="border rounded-xl px-4 py-2 bg-error text-white hover:opacity-80"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              handleEditBranch(branch.Id || "", branch)
                            }
                            className="mr-2 text-success"
                          >
                            <EditRounded />
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(branch.Id)}
                            className="mr-2 text-error"
                          >
                            <DeleteRounded />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(
          (branchData?.totalCount ? branchData?.totalCount : 0) / itemsPerPage
        )}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {addButton && (
        <BranchesMaintenanceAddOverlay
          onOverlayClose={handleOverlayClose}
          onSuccess={handelSuccess}
        />
      )}
    </>
  );
}

export default BranchesMaintenanceContainer;
