import React, { useState } from "react";
import { AddRounded, DeleteRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";
import { useCompanyList } from "@/app/hooks/companies/useCompanyList";
import CompanyAddOverlay from "./CompaniesMaintenanceAddOverlay";
import Pagination from "@/components/Pagination";
import {
  AddOrUpdateCompanyPayloadInterface,
  CompanyDetailInterface,
} from "@/types/CompanyInterface";
import EditRounded from "@mui/icons-material/EditRounded";
import { addOrUpdateCompany } from "@/app/api/companiesDE/companyAddOrUpdate";
import { toast } from "react-toastify";
import { deleteCompany } from "@/app/api/companiesDE/companyDelete";
import { useDeleteCompanyMaintenance } from "@/app/hooks/company/useCompanyDelete";
import { useAddOrUpdateCompaniesMaintenance } from "@/app/hooks/company/useCompanyAddOrUpdate";
import SearchInput from "@/components/SearchBox";

const CompaniesMaintenanceContainer = () => {
  const authKey = getCookie("authKey") as string;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editableCompany, setEditableCompany] =
    useState<CompanyDetailInterface | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [addButton, setAddButton] = useState<boolean>(false);
  const { mutate: deleteCompany } = useDeleteCompanyMaintenance();
  const { mutate: addOrUpdateCompany } = useAddOrUpdateCompaniesMaintenance();
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

  const totalCount = CompanyData?.totalCount || 0;
  const data = CompanyData?.data || [];

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  const handleEditCompany = (companyId: string, company: any) => {
    setEditingCompanyId(companyId);
    setEditableCompany({ ...company });
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  if (CompanyLoading) {
    return <div>Loading...</div>;
  }

  if (CompanyError) {
    return <div>Error loading data.</div>;
  }
  const handleOverlayClose = () => {
    setAddButton(false);
  };
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const handleDeleteCompany = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">
          Are you sure you want to delete this Company?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteCompany({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setCompanies((prevCompany) =>
                  prevCompany.filter((company) => company.Id !== id)
                );

                // toast.success("Company deleted successfully!");
                closeToast();
              } catch (error: any) {
                toast.error("Failed to delete company", {
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

  const handleSaveCompany = async () => {
    if (editableCompany) {
      const payload: AddOrUpdateCompanyPayloadInterface = {
        Id: editingCompanyId,
        Name: editableCompany?.Name,
        Address: editableCompany?.Address,
        EmailAddress: editableCompany?.EmailAddress,
        PhoneNumber: editableCompany?.PhoneNumber,
        PanNumber: editableCompany?.PanNumber,
        ClientId: editableCompany?.ClientId,
        BranchId: editableCompany?.BranchId,
        CompanyTypeId: editableCompany?.CompanyTypeId,
      };

      console.log(payload);

      try {
        if (!editableCompany.EmailAddress || !editableCompany.PhoneNumber) {
          toast.error("Email Address and Phone Number cannot be empty.");
          return;
        }

        await addOrUpdateCompany(payload);

        setEditingCompanyId("");
        setEditableCompany(editableCompany);
        setSortBy("modified");
        setSortOrder("desc");
        toast.success("Company updated successfully!");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error updating company: ${error.message}`);
        } else {
          toast.error("Unknown error updating company");
        }
      }
    }
  };

  const handleCancelCompany = () => {
    setEditingCompanyId(null);
    setEditableCompany(null);
  };
  console.log();
  return (
    <>
      <div className="w-full px-8 mt-4">
        <div className="flex items-center gap-4 mt-[-56px] pl-48">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="flex justify-end mb-4">
          <button
            className="flex items-center px-4 py-2 border-2 bg-success rounded-xl text-white hover:opacity-80"
            onClick={() => setAddButton(!addButton)}
          >
            <AddRounded style={{ color: "white" }} className="mr-2" />
            Add
          </button>
        </div>

        <div className="relative w-full">
          <div className="overflow-x-auto border-2 rounded-lg">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-tablehead border-b-2 text-left">
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("name")}
                  >
                    Name
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("address")}
                  >
                    Address
                    {sortBy === "cursor-pointer py-3 px-5" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("emailaddress")}
                  >
                    Email Address
                    {sortBy === "emailaddress" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("phonenumber")}
                  >
                    Phone Number
                    {sortBy === "phonenumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("pannumber")}
                  >
                    Pan Number
                    {sortBy === "pannumber" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("clientname")}
                  >
                    Client Name
                    {sortBy === "clientname" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("branchname")}
                  >
                    Branch Name
                    {sortBy === "branchname" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("companytype")}
                  >
                    Company Type
                    {sortBy === "companytype" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("created")}
                  >
                    Created
                    {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer py-3 px-5"
                    onClick={() => handleSortChange("modified")}
                  >
                    Modified
                    {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="cursor-pointer py-3 px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {CompanyLoading ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">
                      Loading companies...
                    </td>
                  </tr>
                ) : CompanyError ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">
                      Error loading companies: {CompanyError}
                    </td>
                  </tr>
                ) : CompanyData?.data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">
                      No companies found.
                    </td>
                  </tr>
                ) : (
                  CompanyData?.data.map((company) => (
                    <tr
                      className={`border-b hover:bg-gray-50 cursor-pointer ${
                        company.Id === selectedCompanyId ? "bg-blue-100" : ""
                      }`}
                      key={company.Id}
                    >
                      <td className="p-4">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.Name || ""}
                            onChange={(e) =>
                              setEditableCompany((prev) => ({
                                ...prev!,
                                Name: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          company.Name
                        )}
                      </td>
                      <td className="p-4">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.Address || ""}
                            onChange={(e) =>
                              setEditableCompany((prev) => ({
                                ...prev!,
                                Address: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          company.Address
                        )}
                      </td>
                      <td className="p-4">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.EmailAddress || ""}
                            onChange={(e) =>
                              setEditableCompany((prev) => ({
                                ...prev!,
                                EmailAddress: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          company.EmailAddress
                        )}
                      </td>
                      <td className="p-4">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.PhoneNumber || ""}
                            onChange={(e) =>
                              setEditableCompany((prev) => ({
                                ...prev!,
                                PhoneNumber: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          company.PhoneNumber
                        )}
                      </td>
                      <td className="p-4">
                        {editingCompanyId === company.Id ? (
                          <input
                            type="text"
                            value={editableCompany?.PanNumber || ""}
                            onChange={(e) =>
                              setEditableCompany((prev) => ({
                                ...prev!,
                                PanNumber: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          company.PanNumber
                        )}
                      </td>
                      <td className="p-4">{company.ClientName}</td>
                      <td className="p-4">{company.BranchName}</td>
                      <td className="p-4">{company.CompanyType}</td>
                      <td className="p-4">{company.Created}</td>
                      <td className="p-4">{company.Modified}</td>
                      <td className="p-4 flex gap-2">
                        {editingCompanyId === company.Id ? (
                          <>
                            <button
                              onClick={handleSaveCompany}
                              className="border rounded-xl px-4 py-2 bg-success text-white hover:opacity-80"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelCompany}
                              className="border rounded-xl px-4 py-2 bg-error text-white hover:opacity-80"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                handleEditCompany(company.Id || "", company)
                              }
                              className="mr-2 text-success"
                            >
                              <EditRounded />
                            </button>
                            <button
                              onClick={() => handleDeleteCompany(company.Id)}
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
        totalPages={Math.ceil(
          (CompanyData?.totalCount ? CompanyData?.totalCount : 0) / itemsPerPage
        )}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {addButton && <CompanyAddOverlay onOverlayClose={handleOverlayClose} />}
    </>
  );
};

export default CompaniesMaintenanceContainer;
