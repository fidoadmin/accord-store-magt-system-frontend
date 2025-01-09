"use client";

import React, { useEffect, useState } from "react";
import { fetchPermission } from "../api/permission/permissionGet";
import { PermissionItem } from "@/types/Permission";

interface RolePermissions {
  userole: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

const PermissionsTable: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const data = await fetchPermission();
        console.log("Fetched Permissions:", data);
        setPermissions(data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    getPermissions();
  }, []);

  const togglePermission = (
    sn: number,
    userole: string,
    permissionType: "create" | "read" | "update" | "delete"
  ) => {
    setPermissions((prevState) =>
      prevState.map((item) => {
        if (item.sn === sn) {
          return {
            ...item,
            roles: item.roles.map((role) => {
              if (role.userole === userole) {
                return {
                  ...role,
                  [permissionType]: !role[permissionType],
                };
              }
              return role;
            }),
          };
        }
        return item;
      })
    );
  };

  const handleSaveChanges = () => {
    console.log("Saving Permissions:", permissions);
    alert("Changes have been saved.");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Permissions Management</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Filter by URL"
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Filter by Role"
            className="border p-2 rounded-lg"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Access Label</th>
              <th className="border px-4 py-2 text-left">User Role</th>
              <th className="border px-4 py-2 text-center">Create</th>
              <th className="border px-4 py-2 text-center">Read</th>
              <th className="border px-4 py-2 text-center">Update</th>
              <th className="border px-4 py-2 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((item) =>
              item.roles.map((role) => (
                <tr key={`${item.sn}-${role.userole}`}>
                  {role === item.roles[0] && (
                    <td
                      rowSpan={item.roles.length}
                      className="border px-4 py-2"
                    >
                      {item.url}
                    </td>
                  )}
                  <td className="border px-4 py-2">{role.userole}</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={role.create}
                      onChange={() =>
                        togglePermission(item.sn, role.userole, "create")
                      }
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={role.read}
                      onChange={() =>
                        togglePermission(item.sn, role.userole, "read")
                      }
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={role.update}
                      onChange={() =>
                        togglePermission(item.sn, role.userole, "update")
                      }
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={role.delete}
                      onChange={() =>
                        togglePermission(item.sn, role.userole, "delete")
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-6">
        <button className="bg-error text-white py-2 px-4 rounded-lg">
          Cancel
        </button>
        <button
          className="bg-primary text-white py-2 px-4 rounded-lg"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

function Page() {
  return (
    <div>
      <PermissionsTable />
    </div>
  );
}

export default Page;
