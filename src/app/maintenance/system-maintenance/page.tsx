"use client";
import React, { useState, useEffect } from "react";
import MaintenanceNavigation from "@/components/Maintenance/MaintenanceNavigation";
import BranchesMaintenanceContainer from "@/components/Maintenance/Branches/BranchesMaintenanceContainer";
import CategoriesMaintenanceContainer from "@/components/Maintenance/Categories/CategoriesMaintenanceContainer";
import CompaniesMaintenanceContainer from "@/components/Maintenance/Companies/CompaniesMaintenanceContainer";
import ContainersMaintenanceContainer from "@/components/Maintenance/Containers/ContainersMaintenanceContainer";
import InventoryDescriptionMaintenanceContainer from "@/components/Maintenance/InventoryDescriptions/InventoryDescriptionMaintenanceContainer";

const SystemMaintenancePage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const componentOptions = [
    {
      id: 0,
      label: "Inventory Descriptions",
      Component: InventoryDescriptionMaintenanceContainer,
    },
    { id: 1, label: "Categories", Component: CategoriesMaintenanceContainer },
    // { id: 2, label: "Branches", Component: BranchesMaintenanceContainer },
    // { id: 3, label: "Companies", Component: CompaniesMaintenanceContainer },
    { id: 4, label: "Containers", Component: ContainersMaintenanceContainer },
  ];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(event.target.value);
    setSelectedId(isNaN(id) ? null : id);
  };

  const selectedComponent = componentOptions.find(
    (option) => option.id === selectedId
  );

  return (
    <div className="">
      <MaintenanceNavigation
        setSelectedId={setSelectedId}
        currentRoute={0}
        isUserPage={false}
      />

      {selectedComponent && (
        <div className="mt-10 text-xl font-semibold">
          System Maintenance <span className="mx-2"> &gt; </span>{" "}
          {selectedComponent.label}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
        <select
          value={selectedId ?? ""}
          onChange={handleSelectChange}
          className="border border-gray-300 rounded-xl font-bold px-4 py-2 mt-4 text-sm"
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

      {isClient && selectedComponent ? (
        <selectedComponent.Component />
      ) : (
        <div className="mt-6 text-gray-500">Loading...</div>
      )}
    </div>
  );
};

export default SystemMaintenancePage;
