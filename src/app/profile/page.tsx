"use client";

import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useUserGetList } from "../hooks/users/useUserGetList";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "@/components/Dropdown";
import { useClientList } from "../hooks/client/useClientList";
import { useRoleList } from "../hooks/role/useRoleList";
import { useCompanyList } from "../hooks/companies/useCompanyList";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import { useAddOrUpdateUser } from "../hooks/users/useUserUpdate";
import {
  AddOrUpdateCompanyPayloadInterface,
  CompanyInterface,
} from "@/types/CompanyInterface";
import {
  AddOrUpdateUserPayloadInterface,
  UserPasswordInterface,
  UserUpdateInterface,
} from "@/types/UserInterface";
import { ClientDetailInterface } from "@/types/ClientInterface";
import { RoleDetailInterface } from "@/types/RolesInterface";
import { useAddOrUpdateUserPassword } from "../hooks/users/useUserPassword";

function ProfilePage() {
  const authKey = getCookie("authKey") as string;
  const userId = getCookie("userId") as string;

  const [users, setUsers] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editableUser, setEditableUser] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 10;
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleNew, setVisibleNew] = useState<boolean>(false);
  const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
  const [passChange, setPassChange] = useState<UserPasswordInterface | null>(
    null
  );

  const { mutate: addOrUpdateUserProfile } = useAddOrUpdateUser();
  const { mutate: addOrUpdateUserPassword } = useAddOrUpdateUserPassword();

  const initialInventoryData = {
    Id: "",
    FirstName: "",
    LastName: "",
    Address: "",
    Emailaddress: "",
    Phonenumber: "",
    Password: "",
    RePassword: "",
  };
  const {
    data: userList,
    error: userError,
    isLoading: userLoading,
  } = useUserGetList(userId || "");

  useEffect(() => {
    if (userList) {
      setUsers([userList]);
      setEditableUser(userList);
      console.log("Loaded user:", userList);
    } else {
      console.error("User list not loaded or empty.");
    }
  }, [userList]);

  const { data: clientList, isLoading: clientLoading } = useClientList(
    authKey || "",
    { page: currentPage, limit: itemsPerPage }
  );

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

  const {
    data: CompanyData,
    error: CompanyError,
    isLoading: CompanyLoading,
  } = useCompanyList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy: sortBy,
    sortOrder: sortOrder,
    isinternal: "",
  });

  const [descAddData, setDescAddData] =
    useState<AddOrUpdateUserPayloadInterface>(initialInventoryData);

  useEffect(() => {
    if (userList) {
      setUsers([userList]);
      setEditableUser(userList);
    }
  }, [userList]);

  const handleSave = async () => {
    if (!editingUserId) {
      toast.error("No user selected for editing.");
      return;
    }

    if (editableUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.Id === editingUserId ? { ...user, ...editableUser } : user
        )
      );

      try {
        await addOrUpdateUserProfile(editableUser);
        setEditingUserId(null);
        setEditableUser(null);
        setIsEditing(false);
        toast.success("User details updated successfully!");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error updating user: ${error.message}`);
        } else {
          toast.error("Unknown error updating user profile.");
        }
      }
    }
  };

  useEffect(() => {}, [editingUserId]);

  const handleChangePassword = async () => {
    if (!editingUserId) {
      toast.error("No user selected for password change.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessages(["All password fields are required."]);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessages(["New password and confirm password do not match."]);
      return;
    }

    const passwordData: UserPasswordInterface = {
      Id: editingUserId,
      CurrentPassword: currentPassword,
      ChangePassword: newPassword,
    };

    try {
      console.log("Attempting to change password", passwordData);
      await addOrUpdateUserPassword(passwordData);
      setIsChangingPassword(false);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessages([]);
      toast.success("Password changed successfully!");
    } catch (error: unknown) {
      console.error("Password change error", error);
      if (error instanceof Error) {
        toast.error(`Error changing password: ${error.message}`);
      } else {
        toast.error("Unknown error occurred while changing password.");
      }
    }
  };

  // const handleSetOpenDropdown = (dropdownId: string) => {
  //   if (isEditing) {
  //     setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  //   }
  // };

  const handleSelectClient = (option: { id: string }) => {
    const selectedClient = clientList?.data.find(
      (client: ClientDetailInterface) => client.Id === option.id
    );
    setDescAddData((prevData) => ({
      ...prevData,
      ClientId: option.id,
      ClientName: selectedClient?.Name || "",
    }));
  };
  const handleSelectRole = (option: { id: string }) => {
    const selectedRole = roleList?.data.find(
      (role: RoleDetailInterface) => role.Id === option.id
    );
    setDescAddData((prevData) => ({
      ...prevData,
      RoleId: option.id,
      RoleName: selectedRole?.Name || "",
    }));
  };

  const handleSelectCompany = (option: { id: string }) => {
    const selectedCompany = CompanyData?.data.find(
      (company: CompanyInterface) => company.Id === option.id
    );
    setDescAddData((prevData) => ({
      ...prevData,
      CompanyId: option.id,
      CompanyName: selectedCompany?.Name || "",
    }));
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditingUserId(null);
    setEditableUser(userList);
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center py-8">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          User Profile
        </h1>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-primary font-bold mb-4">
            {editableUser?.FirstName?.charAt(0)}
            {editableUser?.LastName?.charAt(0)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">First Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editableUser?.FirstName || ""}
                  onChange={(e) =>
                    setEditableUser({
                      ...editableUser,
                      FirstName: e.target.value,
                    })
                  }
                  className="border px-3 py-1 rounded-lg w-2/3"
                />
              ) : (
                <span>{editableUser?.FirstName || "N/A"}</span>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <span className="font-semibold text-gray-600">Last Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editableUser?.LastName || ""}
                  onChange={(e) =>
                    setEditableUser({
                      ...editableUser,
                      LastName: e.target.value,
                    })
                  }
                  className="border px-3 py-1 rounded-lg w-2/3"
                />
              ) : (
                <span>{editableUser?.LastName || "N/A"}</span>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <span className="font-semibold text-gray-600">
                Email Address:
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editableUser?.EmailAddress || ""}
                  onChange={(e) =>
                    setEditableUser({
                      ...editableUser,
                      EmailAddress: e.target.value,
                    })
                  }
                  className="border px-3 py-1 rounded-lg w-2/3"
                />
              ) : (
                <span>{editableUser?.EmailAddress || "N/A"}</span>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <span className="font-semibold text-gray-600">Phone Number:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editableUser?.PhoneNumber || ""}
                  onChange={(e) =>
                    setEditableUser({
                      ...editableUser,
                      PhoneNumber: e.target.value,
                    })
                  }
                  className="border px-3 py-1 rounded-lg w-2/3"
                />
              ) : (
                <span>{editableUser?.PhoneNumber || "N/A"}</span>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <span className="font-semibold text-gray-600">Staff Number:</span>
              <span>{editableUser?.StaffNumber || "N/A"}</span>
            </div>

            <div className="flex justify-between mt-4">
              <span className="font-semibold text-gray-600">Client:</span>
              <span>{editableUser?.ClientName || "N/A"}</span>
            </div>

            <div className="flex justify-between mt-4">
              <span className="font-semibold text-gray-600">Role:</span>
              <span>{editableUser?.RoleName || "N/A"}</span>
            </div>

            <div className="flex justify-between mt-4">
              <span className="font-semibold text-gray-600">Company:</span>
              <span>{editableUser?.CompanyName || "N/A"}</span>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-success text-white py-2 px-4 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-error text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditingUserId(editableUser?.Id);
                  }}
                  className="bg-primary text-white py-2 px-4 rounded-lg"
                >
                  Edit Profile
                </button>

                {!isChangingPassword && (
                  <button
                    onClick={() => {
                      setEditingUserId(editableUser?.Id);
                      setIsChangingPassword(true);
                    }}
                    className="bg-primary text-white py-2 px-4 rounded-lg"
                  >
                    Password Settings
                  </button>
                )}
              </>
            )}
          </div>

          {isChangingPassword && (
            <div className="mt-6 space-y-4">
              <div className="relative">
                <label className="block text-gray-600 font-semibold">
                  Current Password:
                </label>
                <input
                  type={visible ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border border-primary rounded-lg px-2 py-2 w-full pr-10 mb-3"
                />
                <span
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <VisibilityRounded /> : <VisibilityOffRounded />}
                </span>
              </div>

              <div className="relative">
                <label className="block text-gray-600 font-semibold">
                  New Password:
                </label>
                <input
                  type={visibleNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-primary rounded-lg px-2 py-2 w-full mb-3 pr-10"
                />
                <span
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setVisibleNew(!visibleNew)}
                >
                  {visibleNew ? (
                    <VisibilityRounded />
                  ) : (
                    <VisibilityOffRounded />
                  )}
                </span>
              </div>

              <div className="relative">
                <label className="block text-gray-600 font-semibold">
                  Confirm Password:
                </label>
                <input
                  type={visibleConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-primary rounded-lg px-2 py-2 w-full mb-3 pr-10"
                />
                <span
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setVisibleConfirm(!visibleConfirm)}
                >
                  {visibleConfirm ? (
                    <VisibilityRounded />
                  ) : (
                    <VisibilityOffRounded />
                  )}
                </span>
              </div>

              {errorMessages.length > 0 && (
                <div className="text-error text-sm space-y-2">
                  {errorMessages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setEditingUserId(editableUser?.Id);
                  handleChangePassword();
                }}
                className="py-2 px-4 bg-success text-white rounded-lg w-full"
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
