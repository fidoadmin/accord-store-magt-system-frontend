import React, { useState } from "react";
import { getCookie } from "cookies-next";
import Pagination from "@/components/Pagination";
import { useRoleList } from "@/app/hooks/role/useRoleList";
import SearchInput from "@/components/SearchBox";
import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import RoleAddOverlay from "./RolesMaintenanceAddOverlay";
import { useAddOrUpdateRoleMaintenance } from "@/app/hooks/role/useRoleAddOrUpdate";
import {
  AddOrUpdateRolePayloadInterface,
  RoleDetailInterface,
} from "@/types/RolesInterface";
import { toast } from "react-toastify";
import { useDeleteRoleMaintenance } from "@/app/hooks/role/useRoleDelete";

function RoleMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addbutton, setAddButton] = useState(false);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [roles, setRoles] = useState<any[]>([]);
  const [editableRole, setEditableRole] = useState<RoleDetailInterface | null>(
    null
  );
  const { mutate: deleteRole } = useDeleteRoleMaintenance();
  const { mutate: addOrUpdateRole } = useAddOrUpdateRoleMaintenance();

  const {
    data: roleList,
    error: roleError,
    isLoading: roleLoading,
  } = useRoleList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy,
    sortOrder,
  });
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const handleOverlayClose = () => {
    setAddButton(false);
  };
  const handleSaveRole = async () => {
    if (editableRole) {
      const payload: AddOrUpdateRolePayloadInterface = {
        Id: editingRoleId || "",
        Name: editableRole?.Name,
        Code: editableRole?.Code,
      };

      try {
        await addOrUpdateRole(payload);
        setEditingRoleId(null);
        setEditableRole(null);
        setSortBy("modified");
        setSortOrder("desc");
        toast.success("Role updated successfully!");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error updating role: ${error.message}`);
        } else {
          toast.error("Unknown error updating role.");
        }
      }
    }
  };
  const handleEditRole = (roleId: string, role: any) => {
    setEditingRoleId(roleId);
    setEditableRole({ ...role });
  };
  const handleCancelRole = () => {
    setEditingRoleId(null);
    setEditableRole(null);
  };
  const handleDeleteRole = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">Are you sure you want to delete this role?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteRole({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setRoles((prevRole) =>
                  prevRole.filter((role) => role.Id !== id)
                );

                closeToast();
              } catch (error: any) {
                toast.error("Failed to delete role", {
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
              onClick={() => setAddButton(!addbutton)}
            >
              Add
              <AddRounded />
            </button>
          </div>
          <div className="overflow-x-auto border-2 rounded-lg">
            <table className="w-full border-collapse">
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
                    onClick={() => handleSortChange("code")}
                  >
                    Code{" "}
                    {sortBy === "code" && (sortOrder === "asc" ? "↑" : "↓")}
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
              <tbody>
                {roleLoading ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      Loading roles...
                    </td>
                  </tr>
                ) : roleError ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      Error loading roles: {roleError.message}
                    </td>
                  </tr>
                ) : roleList?.data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  roleList?.data.map((role) => (
                    <tr
                      className={`border-b hover:bg-gray-100 ${
                        role.Id === selectedRoleId ? "bg-blue-100" : ""
                      }`}
                      key={role.Id}
                    >
                      <td className="py-3 px-5">
                        {editingRoleId === role.Id ? (
                          <input
                            type="text"
                            value={editableRole?.Name || ""}
                            onChange={(e) =>
                              setEditableRole((prev) => ({
                                ...prev!,
                                Name: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          role.Name
                        )}
                      </td>
                      <td className="py-3 px-5">{role.Code}</td>
                      <td className="py-3 px-5">{role.Created}</td>
                      <td className="py-3 px-5">{role.Modified}</td>
                      <td className="p-4 flex gap-2">
                        {editingRoleId === role.Id ? (
                          <>
                            <button
                              onClick={handleSaveRole}
                              className="border rounded-xl px-4 py-2 bg-success text-white hover:opacity-80"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelRole}
                              className="border rounded-xl px-4 py-2 bg-error text-white hover:opacity-80"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                handleEditRole(role.Id || "", role)
                              }
                              className="mr-2 text-success"
                            >
                              <EditRounded />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.Id)}
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil((roleList?.totalCount || 0) / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
      {addbutton && <RoleAddOverlay onOverlayClose={handleOverlayClose} />}
    </>
  );
}

export default RoleMaintenanceContainer;
