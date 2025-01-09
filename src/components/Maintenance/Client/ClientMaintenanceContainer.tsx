import React, { useState } from "react";
import { AddRounded, EditRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";
import SearchInput from "@/components/SearchBox";
import ClientAddOverlay from "./ClientMaintenanceAddOverlay";
import { toast } from "react-toastify";
import { useClientList } from "@/app/hooks/client/useClientList";
import {
  AddOrUpdateClientPayloadInterface,
  ClientDetailInterface,
} from "@/types/ClientInterface";
import { useAddOrUpdateClientMaintenance } from "@/app/hooks/client/useClientAddOrUpdate";
import Pagination from "@/components/Pagination";

function ClientMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;
  const [addbutton, setAddButton] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editableClient, setEditableClient] =
    useState<ClientDetailInterface | null>(null);

  const [clients, setClients] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const { mutate: addOrUpdateClient } = useAddOrUpdateClientMaintenance();

  const {
    data: clientList,
    error: clientError,
    isLoading: clientLoading,
  } = useClientList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  const totalCount = clientList?.totalCount || 0;
  const data = clientList?.data || [];

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  const handleEditClient = (clientId: string, client: any) => {
    setEditingClientId(clientId);
    setEditableClient({ ...client });
  };

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleSaveClient = async () => {
    if (editableClient) {
      const payload: AddOrUpdateClientPayloadInterface = {
        Id: editingClientId || "",
        Name: editableClient?.Name,
        Code: editableClient?.Code,
      };

      try {
        await addOrUpdateClient(payload);
        setEditingClientId(null);
        setEditableClient(null);
        setSortBy("modified");
        setSortOrder("desc");
        toast.success("Client updated successfully!");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error updating client: ${error.message}`);
        } else {
          toast.error("Unknown error updating client.");
        }
      }
    }
  };
  const handleCancelClient = () => {
    setEditingClientId(null);
    setEditableClient(null);
  };

  const handleOverlayClose = () => {
    setAddButton(false);
  };
  const handelSuccess = async (newClient: any) => {
    if (newClient) {
      setClients((prevClients) => [newClient, ...prevClients]);
      setSortBy("created");
      setSortOrder("desc");
      toast.success("Client added successfully!");
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
              onClick={() => setAddButton(!addbutton)}
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
                {clientLoading ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">
                      Loading clients...
                    </td>
                  </tr>
                ) : clientError ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">
                      Error loading clients: {clientError.message}
                    </td>
                  </tr>
                ) : clientList?.data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  clientList?.data.map((client) => (
                    <tr
                      className={`border-b hover:bg-gray-100 ${
                        client.Id === selectedClientId ? "bg-blue-100" : ""
                      }`}
                      key={client.Id}
                    >
                      <td className="py-3 px-5">
                        {editingClientId === client.Id ? (
                          <input
                            type="text"
                            value={editableClient?.Name || ""}
                            onChange={(e) =>
                              setEditableClient((prev) => ({
                                ...prev!,
                                Name: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          client.Name
                        )}
                      </td>
                      <td className="py-3 px-5">{client.Code}</td>
                      <td className="py-3 px-5">{client.Created}</td>
                      <td className="py-3 px-5">{client.Modified}</td>
                      <td className="p-4 flex gap-2">
                        {editingClientId === client.Id ? (
                          <>
                            <button
                              onClick={handleSaveClient}
                              className="border rounded-xl px-4 py-2 bg-success text-white hover:opacity-80"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelClient}
                              className="border rounded-xl px-4 py-2 bg-error text-white hover:opacity-80"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              handleEditClient(client.Id || "", client)
                            }
                            className="mr-2 text-success"
                          >
                            <EditRounded />
                          </button>
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
        totalPages={Math.ceil(
          (clientList?.totalCount ? clientList?.totalCount : 0) / itemsPerPage
        )}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {addbutton && (
        <ClientAddOverlay
          onOverlayClose={handleOverlayClose}
          onSuccess={handelSuccess}
        />
      )}
    </>
  );
}

export default ClientMaintenanceContainer;
