import React, { useState, useEffect } from "react";
import { AddRounded, EditRounded, DeleteRounded } from "@mui/icons-material";
import { deleteUsers } from "@/app/api/userDE/userDelete";
import { useUserList } from "@/app/hooks/users/useUserList";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import SearchInput from "@/components/SearchBox";
import UserAddOverlay from "./UserMaintenanceAddOverlay";
import { useDeleteUserMaintenance } from "@/app/hooks/user/useUserDelete";
import { useAddOrUpdateUserMaintenance } from "@/app/hooks/user/useUserAddOrUpdate";
import { AddOrUpdateUserPayloadInterface } from "@/types/UserInterface";
import Pagination from "@/components/Pagination";
import TableHeader from "@/components/TableHeader";

function UserMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;
  const [addbutton, setAddButton] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editableUser, setEditableUser] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(
    null
  );
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const { mutate: deleteUsers } = useDeleteUserMaintenance();
  const { mutate: addOrUpdateUser } = useAddOrUpdateUserMaintenance();

  const {
    data: userList,
    error: userError,
    isLoading: userLoading,
  } = useUserList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    varsortby: sortBy,
    varsortorder: sortOrder,
  });

  useEffect(() => {
    if (userList) {
      setUsers(userList.data);
    }
  }, [userList]);

  const totalCount = userList?.totalCount || 0;
  const data = userList?.data || [];

  console.log(userList);

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  const handleEditUser = (userId: string, user: any) => {
    setEditingUserId(userId);
    setEditableUser({ ...user });
  };

  const handleSaveUser = async () => {
    if (editableUser) {
      const payload: AddOrUpdateUserPayloadInterface = {
        Id: editingUserId || "",
        FirstName: editableUser?.FirstName,
        LastName: editableUser?.LastName,
        Address: editableUser?.Address,
        EmailAddress: editableUser?.EmailAddress,
        PhoneNumber: editableUser?.PhoneNumber,
        // Password: editableUser?.Password,
      };

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.Id === editingUserId ? { ...user, ...editableUser } : user
        )
      );

      try {
        await addOrUpdateUser(payload);
        setEditingUserId(null);
        setEditableUser(null);
        toast.success("User details updated successfully!");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error updating user: ${error.message}`);
        } else {
          toast.error("Unknown error updating user.");
        }
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditableUser(null);
  };

  const handleOverlayClose = () => {
    setAddButton(false);
  };

  const handleDelete = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">Are you sure you want to delete this user?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteUsers({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setUsers((prevUsers) =>
                  prevUsers.filter((user) => user.Id !== id)
                );

                toast.success("User deleted successfully!");
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
  return (
    <>
      <TableHeader
        tableTitle="User Maintenance"
        dataTitle="Users"
        button={true}
        handleSortChange={() => {}}
        sortby="username"
        sortorder="asc"
      />

      <div className="w-full px-8 mt-4">
        <h1 className="text-2xl font-bold mb-4"></h1>

        <div className="flex items-center gap-4 mt-[-56px] pl-48">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="relative w-full">
          <div className="py-1 flex justify-end mb-2">
            <button
              className="btn bg-success rounded-xl px-4 py-2 text-white flex items-center md:justify-around mb-6"
              type="button"
              onClick={() => setAddButton(!addbutton)}
            >
              Add
              <AddRounded />
            </button>
          </div>

          <div className="overflow-x-auto overflow-y-auto border-2 rounded-lg relative top-[-5px]">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-tablehead border-b-2 text-left">
                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("staffnumber")}
                  >
                    Staff Number
                    {sortBy === "staffnumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("firstname")}
                  >
                    First Name
                    {sortBy === "firstname" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("lastname")}
                  >
                    Last Name
                    {sortBy === "lastname" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("address")}
                  >
                    Address
                    {sortBy === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("phonenumber")}
                  >
                    Phone Number
                    {sortBy === "phonenumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("emailaddress")}
                  >
                    Email Address
                    {sortBy === "emailaddress" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("clientname")}
                  >
                    Client
                    {sortBy === "clientname" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("rolename")}
                  >
                    Role
                    {sortBy === "rolename" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b py-3 px-5 text-sm"
                    onClick={() => handleSortChange("companyname")}
                  >
                    Company
                    {sortBy === "companyname" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="cursor-pointer  border-b  pl-3 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {userLoading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      Loading users...
                    </td>
                  </tr>
                ) : userError ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      Error loading users: {userError.message}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      className={`border-b hover:bg-gray-50 ${
                        user.Id === selectedUserId ? "bg-blue-100" : ""
                      }`}
                      key={user.Id}
                    >
                      <td className="text-left pl-8">
                        {user.StaffNumber || "NA"}
                      </td>
                      <td className="p-4">
                        {editingUserId === user.Id ? (
                          <input
                            type="text"
                            value={editableUser?.FirstName || ""}
                            onChange={(e) =>
                              setEditableUser({
                                ...editableUser,
                                FirstName: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          user.FirstName
                        )}
                      </td>
                      <td className="p-4">
                        {editingUserId === user.Id ? (
                          <input
                            type="text"
                            value={editableUser?.LastName || ""}
                            onChange={(e) =>
                              setEditableUser({
                                ...editableUser,
                                LastName: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          user.LastName
                        )}
                      </td>
                      <td className="p-4">
                        {editingUserId === user.Id ? (
                          <input
                            type="text"
                            value={editableUser?.Address || ""}
                            onChange={(e) =>
                              setEditableUser({
                                ...editableUser,
                                Address: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          user.Address
                        )}
                      </td>

                      <td className="p-4">
                        {editingUserId === user.Id ? (
                          <input
                            type="text"
                            value={editableUser?.PhoneNumber || ""}
                            onChange={(e) =>
                              setEditableUser({
                                ...editableUser,
                                PhoneNumber: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          user.PhoneNumber
                        )}
                      </td>
                      <td className="text-left pl-4 ">
                        {user.EmailAddress || "NA"}
                      </td>

                      <td className="text-left pl-6">
                        {user.ClientName || "NA"}
                      </td>
                      <td className="text-left pl-6">
                        {user.RoleName || "NA"}
                      </td>
                      <td className="text-left pl-6">
                        {user.CompanyName || "NA"}
                      </td>
                      <td className="p-4 flex gap-2">
                        {editingUserId === user.Id ? (
                          <>
                            <button
                              onClick={handleSaveUser}
                              className="border rounded-xl px-4 py-2 bg-success text-white hover:opacity-80"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="border rounded-xl px-4 py-2 bg-error text-white hover:opacity-80"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditUser(user.Id, user)}
                              className="mr-2 text-success"
                            >
                              <EditRounded />
                            </button>
                            <button
                              onClick={() => handleDelete(user.Id)}
                              className="text-error"
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
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(
              (userList?.totalCount ? userList?.totalCount : 0) / itemsPerPage
            )}
            onPageChange={(page) => setCurrentPage(page)}
          />
          {addbutton && <UserAddOverlay onOverlayClose={handleOverlayClose} />}
        </div>
      </div>
    </>
  );
}

export default UserMaintenanceContainer;
