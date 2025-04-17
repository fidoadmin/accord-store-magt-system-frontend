"use client";
import RecieveBranchTransferOverlay from "@/components/RecieveBranchTransferOverlay";
import { EditRounded } from "@mui/icons-material";
import React, { useState } from "react";

const receiveData = [
  {
    id: 1,
    description: "Paracetamol 500mg",
    batchNumber: "BATCH-001",
    expirationDate: "2026-02-01",
    quantity: "10",
    status: "Pending",
  },
  {
    id: 2,
    description: "Cough Syrup 100ml",
    batchNumber: "BATCH-002",
    expirationDate: "2025-11-15",
    quantity: "10",
    status: "Received",
  },
  {
    id: 3,
    description: "Vitamin D Capsules",
    batchNumber: "BATCH-003",
    expirationDate: "2026-06-30",
    quantity: "10",
    status: "Pending",
  },
];

export default function NewReceiveCheckinPage() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<any | null>(null);

  const handleEditClick = (item: any) => {
    setSelectedInventory({ NumberOfPacket: item.numberOfPacket });
    setShowOverlay(true);
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);
    setSelectedInventory(null);
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Receive Branch Transfer</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Batch Number</th>
              <th className="px-4 py-2 text-left">Expiration Date</th>
              <th className="px-4 py-2 text-left">Shipper Quantity</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {receiveData.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2">{item.batchNumber}</td>
                <td className="px-4 py-2">{item.expirationDate}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      item.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-success">
                  <button onClick={() => handleEditClick(item)}>
                    <EditRounded />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showOverlay && selectedInventory && (
        <RecieveBranchTransferOverlay
          inventory={selectedInventory}
          onClose={handleOverlayClose}
        />
      )}
    </div>
  );
}
