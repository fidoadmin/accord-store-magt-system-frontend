"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CheckoutReport from "@/components/CheckoutReport";
import SalesReport from "@/components/SaleReport";
import Dropdown from "@/components/Dropdown";
import { useCompanyList } from "../../hooks/companies/useCompanyList";
import { getCookie } from "cookies-next";
import { useInventoryDescriptionForMaintenance } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionForMaintenance";

const ReportPage = () => {
  const [selectedReport, setSelectedReport] = useState<string>("checkout");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedInventoryDescription, setSelectedInventoryDescription] =
    useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [action, setAction] = useState<"pdf" | "csv" | "abc">("abc");

  const [statusAllEnabled, setStatusAllEnabled] = useState(false);
  const [typeAllEnabled, setTypeAllEnabled] = useState(false);

  const formatDate = (date: Date) =>
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0");

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleReportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInventoryDescription("");
    setSelectedCustomer("");
    setSelectedReport(event.target.value);
  };

  const handleStatusFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;

    setStatusFilter(selectedValue);

    if (selectedValue === "all") {
      setStatusAllEnabled(false);
    } else {
      setStatusAllEnabled(true);
    }
  };

  const handleTypeFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;

    setTypeFilter(selectedValue);

    if (selectedValue === "all") {
      setTypeAllEnabled(false);
    } else {
      setTypeAllEnabled(true);
    }
  };

  const handleDateFromSelect = (date: Date | null) => {
    setFromDate(date ? formatDate(date) : "");
  };

  const handleDateToSelect = (date: Date | null) => {
    setToDate(date ? formatDate(date) : "");
  };

  const [authKey, setAuthKey] = useState<string | null>(null);

  useEffect(() => {
    const authKey = getCookie("authKey") as string;
    setAuthKey(authKey);
  }, []);

  const { data: CustomerData } = useCompanyList(authKey || "", {
    iscustomer: "true",
    page: 0,
    limit: 0,
  });

  const { data: InventoryDescriptionData } =
    useInventoryDescriptionForMaintenance(authKey || "", { page: 0, limit: 0 });

  const onDownloadComplete = () => {
    setAction("abc");
  };

  const handleCustomerSelect = (option: { id: string; name: string }) => {
    setSelectedCustomer(option.id);
  };

  const handleInventoryDescriptionSelect = (option: {
    id: string;
    name: string;
  }) => {
    setSelectedInventoryDescription(option.id);
  };

  const handleSetOpenDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleActionChange = (actionType: "pdf" | "csv") => {
    setAction(actionType);
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Reports</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <select
            id="report-select"
            value={selectedReport}
            onChange={handleReportChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            <option value="sales">Sales</option>
            <option value="checkout">Checkout</option>
          </select>
        </div>

        {selectedReport === "sales" && (
          <div className="w-full md:w-auto">
            <Dropdown
              label="Customer"
              options={
                CustomerData?.data.map((customer) => ({
                  id: customer.Id,
                  name: customer.Name,
                })) ?? []
              }
              isOpen={openDropdown === "customer"}
              setIsOpen={() => handleSetOpenDropdown("customer")}
              onSelect={handleCustomerSelect}
              placeholder="Select Customer"
              search
            />
          </div>
        )}

        {selectedReport === "sales" && (
          <div className="w-full md:w-auto">
            <Dropdown
              label="Description"
              options={
                InventoryDescriptionData?.data.map((description) => ({
                  id: description.Id,
                  name: `${
                    !!description.ShortName
                      ? `${description.ShortName} (${description.Description} )`
                      : `${description.Description}`
                  }`,
                })) ?? []
              }
              isOpen={openDropdown === "description"}
              setIsOpen={() => handleSetOpenDropdown("description")}
              onSelect={handleInventoryDescriptionSelect}
              placeholder="Select Short Name"
              search
            />
          </div>
        )}

        {selectedReport === "checkout" && (
          <div className="w-full md:w-auto">
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-xl"
            >
              <option value="all" disabled={!statusAllEnabled}>
                {statusFilter === "all" ? "Status" : "All"}
              </option>
              <option value="cancelled">Cancelled</option>
              <option value="dispatched">Dispatched</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        )}

        {selectedReport === "checkout" && (
          <div className="w-full md:w-auto">
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-xl"
            >
              <option value="all" disabled={!typeAllEnabled}>
                {typeFilter === "all" ? "Type" : "All"}
              </option>
              <option value="branch">Branch</option>
              <option value="external">External</option>
            </select>
          </div>
        )}

        <div className="w-full md:w-auto mb-1">
          <label htmlFor="date-from" className="font-semibold text-lg"></label>
          <DatePicker
            id="date-from"
            dateFormat="yyyy-MM-dd"
            placeholderText="Date From"
            selected={fromDate ? new Date(fromDate) : null}
            onChange={handleDateFromSelect}
            isClearable
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          />
        </div>

        <div className="w-full md:w-auto mb-1">
          <label htmlFor="date-to" className="font-semibold text-lg"></label>
          <DatePicker
            id="date-to"
            dateFormat="yyyy-MM-dd"
            placeholderText="Date To"
            selected={toDate ? new Date(toDate) : null}
            onChange={handleDateToSelect}
            isClearable
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          />
        </div>
      </div>

      {selectedReport === "sales" && (
        <div className="mb-6 flex justify-end space-x-4">
          <button
            onClick={() => handleActionChange("pdf")}
            className="px-4 py-2 bg-success text-white rounded-xl"
          >
            📄 PDF{" "}
          </button>
          <button
            onClick={() => handleActionChange("csv")}
            className="px-4 py-2 bg-success text-white rounded-xl"
          >
            📄 CSV{""}
          </button>
        </div>
      )}

      {selectedReport === "checkout" ? (
        <CheckoutReport
          fromDate={fromDate}
          toDate={toDate}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
        />
      ) : (
        <SalesReport
          fromDate={fromDate}
          toDate={toDate}
          customerId={selectedCustomer}
          inventoryDescriptionId={selectedInventoryDescription}
          action={action}
          onDownloadComplete={onDownloadComplete}
        />
      )}
    </main>
  );
};

export default ReportPage;
