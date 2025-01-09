"use client";

import React, { useState, useEffect } from "react";
import MaintenanceNavigation from "@/components/Maintenance/MaintenanceNavigation";
import UserMaintenanceContainer from "@/components/Maintenance/Users/UserMaintenanceContainer";
import AgentsMaintenanceContainer from "@/components/Maintenance/Agents/AgentsMaintenanceContainer";
import ClientMaintenanceContainer from "@/components/Maintenance/Client/ClientMaintenanceContainer";
import CompaniesMaintenanceContainer from "@/components/Maintenance/Companies/CompaniesMaintenanceContainer";
import BranchesMaintenanceContainer from "@/components/Maintenance/Branches/BranchesMaintenanceContainer";
import RolesMaintenance from "@/components/Maintenance/Roles/RolesMaintenance";

const UserMaintenancePage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const componentOptions = [
    { id: 5, label: "Clients", Component: ClientMaintenanceContainer },
    { id: 6, label: "Branches", Component: BranchesMaintenanceContainer },
    { id: 7, label: "Company", Component: CompaniesMaintenanceContainer },
    { id: 8, label: "Role", Component: RolesMaintenance },
    { id: 9, label: "Users", Component: UserMaintenanceContainer },
    // { id: 6, label: "Agents", Component: AgentsMaintenanceContainer },
  ];

  useEffect(() => {
    setIsMounted(true);

    setSelectedId(5);
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(event.target.value);
    setSelectedId(isNaN(id) ? null : id);
  };

  const selectedComponentOption = componentOptions.find(
    (option) => option.id === selectedId
  );

  const selectedComponentLabel = selectedComponentOption?.label;

  return (
    <div className="">
      <MaintenanceNavigation
        setSelectedId={setSelectedId}
        currentRoute={5}
        isUserPage={true}
      />

      {selectedComponentLabel && (
        <div className="mt-6 text-xl font-semibold">
          User Maintenance <span className="mx-2">&gt;</span>{" "}
          {selectedComponentLabel}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
        <select
          value={selectedId ?? ""}
          onChange={handleSelectChange}
          className="border border-gray-300 rounded-xl font-bold px-4 py-2"
        >
          <option value="" disabled>
            Select a component
          </option>
          {componentOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isMounted &&
        selectedComponentOption &&
        React.createElement(selectedComponentOption.Component)}
    </div>
  );
};

export default UserMaintenancePage;
