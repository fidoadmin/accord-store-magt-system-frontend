"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface InventoryItem {
  name: string;
  details: string;
}

interface InventoryData {
  DescriptionId: string;
  items: InventoryItem[];
}

const InventoryDetailsPage = () => {
  const router = useRouter();

  const [inventoryData, setInventoryData] = useState<InventoryData | null>(
    null
  );

  useEffect(() => {
    const hardcodedData: InventoryData = {
      DescriptionId: "D1234",
      items: [
        {
          name: "Sample Inventory Item",
          details: "Detailed info about this item",
        },
        {
          name: "Another Inventory Item",
          details: "Another detailed description",
        },
      ],
    };

    setInventoryData(hardcodedData);
  }, []);

  if (!inventoryData) {
    return (
      <div className="container p-4">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  const { items } = inventoryData;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Inventory Details</h1>
      <table className="min-w-full border-collapse table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
              Item Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.details}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button
        onClick={() => router.push("/inventory")}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
      >
        Back to Inventory
      </button> */}
    </div>
  );
};

export default InventoryDetailsPage;
