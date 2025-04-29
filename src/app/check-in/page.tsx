"use client";
import { useState, useEffect } from "react";
import {
  AddRounded,
  EditRounded,
  DeleteRounded,
  SaveRounded,
  CancelRounded,
} from "@mui/icons-material";
import NewBulkCheckin from "@/components/NewBulkCheckin";
import BulkCheckinOverlay from "../continuebulk/page";

export default function InventoryTable() {
  interface ScannedItem {
    isEditing: boolean;
    serialNumber?: string;
    barcode: string;
  }

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showBulkCheckInOverlay, setShowBulkCheckInOverlay] =
    useState<boolean>(false);
  const [showContinueOverlay, setShowContinueOverlay] =
    useState<boolean>(false);
  const [editRow, setEditRow] = useState<number | null>(null);
  const [isAddDisabled, setIsAddDisabled] = useState(true);
  const [hasScannedItems, setHasScannedItems] = useState<boolean>(false);

  interface Item {
    Id: number;
    BarCode: string;
    ItemBarcode: string;
    ShortName: string;
    GenericName: string;
    NumberOfPacket: number | null;
    ManufacturerDate: string;
    ExpiryDate: string;
    BatchNumber: string;
    GrossWeight: string;
    isContinued?: boolean;
  }

  const initialData: Item[] = [
    {
      Id: 1,
      BarCode: "BOX123",
      ItemBarcode: "",
      ShortName: "Test Item",
      GenericName: "Generic Test",
      NumberOfPacket: 3,
      ManufacturerDate: "2023-01-01",
      ExpiryDate: "2024-01-01",
      BatchNumber: "B001",
      GrossWeight: "",
    },
  ];

  const [data, setData] = useState<Item[]>(initialData);

  const handleSortChange = (column: any) => {
    setSortBy(column);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleEdit = (id: any) => setEditRow(id);

  const handleSave = (id: any) => {
    setEditRow(null);
  };

  const handleCancel = (id: number) => {
    setEditRow(null);
  };

  const handleDelete = (id: any) => alert(`Delete item with ID: ${id}`);

  const handleChange = (e: any, id: any, field: any) => {
    const updatedData = data.map((item: any) =>
      item.Id === id
        ? {
            ...item,
            [field]: e.target.value,
          }
        : item
    );

    setData(updatedData);
  };

  useEffect(() => {
    const allPacketsEntered = data.every(
      (item) => item.NumberOfPacket && item.NumberOfPacket > 0
    );
    setIsAddDisabled(!allPacketsEntered);
  }, [data]);

  const handleOverlayToggle = () => {
    setShowBulkCheckInOverlay(!showBulkCheckInOverlay);
  };

  const handleContinueMoreClick = () => {
    setShowContinueOverlay(true);
  };

  const handleContinueYes = () => {
    const lastItem = data[data.length - 1];

    const newItem = {
      ...lastItem,
      Id: data.length + 1,
      BarCode: "",
      ItemBarcode: "",
      NumberOfPacket: null,
      GrossWeight: "",
      isContinued: true,
    };

    setData([...data, newItem]);
    setEditRow(newItem.Id);
    setShowContinueOverlay(false);
  };

  const handleContinueNo = () => {
    alert("Operation completed");
    setShowContinueOverlay(false);
  };

  const handleScanConfirm = (
    scannedItems: ScannedItem[],
    grossWeight: string
  ) => {
    const currentItemIndex = data.length - 1;
    const currentItem = data[currentItemIndex];

    const itemBarcodes = scannedItems.map((item) => item.barcode).join(", ");

    const updatedItem = {
      ...currentItem,
      ItemBarcode: itemBarcodes,
      GrossWeight: grossWeight,
    };

    const updatedData = [...data];
    updatedData[currentItemIndex] = updatedItem;
    setData(updatedData);

    setHasScannedItems(true);
  };

  return (
    <>
      <div className="text-4xl">Shipper-Checkin</div>
      <div className="relative w-full">
        <div className="py-1 flex justify-end mb-8">
          <button
            className="btn bg-success rounded-xl px-4 py-2 text-white flex items-center md:justify-around mb-6 disabled:opacity-40"
            type="button"
            onClick={handleOverlayToggle}
            title="Bulk Scan"
            disabled={isAddDisabled}
          >
            Add
            <span className="hidden group-hover:inline pr-2">Add</span>
            <AddRounded />
          </button>

          {showBulkCheckInOverlay && (
            <NewBulkCheckin
              onClose={handleOverlayToggle}
              inventory={{
                NumberOfPacket: data[data.length - 1].NumberOfPacket,
              }}
              onConfirm={handleScanConfirm}
            />
          )}
        </div>

        <div className="overflow-x-fixed border-2 rounded-lg relative top-[-40px]">
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr className="border-b-2 text-left">
                <th className="cursor-pointer text-left border-b py-3 px-5 text-sm">
                  Barcode
                </th>
                {hasScannedItems && (
                  <th className="cursor-pointer text-left border-b py-3 px-5 text-sm">
                    ItemBarcode
                  </th>
                )}
                <th className="cursor-pointer text-left border-b py-3 px-5 text-sm">
                  Short Name
                </th>
                <th className="cursor-pointer text-left border-b py-3 px-5 text-sm">
                  Generic Name
                </th>
                <th className="cursor-pointer text-left border-b py-3 px-5 text-sm">
                  No of Packet
                </th>
                <th className="border-b py-3 px-5">Manufacturer Date</th>
                <th className="border-b py-3 px-5">Expiry Date</th>
                <th className="border-b py-3 px-5">Batch No</th>
                <th className="border-b py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.Id}>
                  <td className="border-b py-3 px-5">
                    {editRow === item.Id ? (
                      <input
                        type="text"
                        value={item.BarCode}
                        onChange={(e) => handleChange(e, item.Id, "BarCode")}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      item.BarCode
                    )}
                  </td>
                  {hasScannedItems && (
                    <td className="border-b py-3 px-5">
                      {editRow === item.Id ? (
                        <input
                          type="text"
                          value={item.ItemBarcode}
                          onChange={(e) =>
                            handleChange(e, item.Id, "ItemBarcode")
                          }
                          className="border rounded px-2 py-1 w-full"
                          disabled={item.isContinued}
                        />
                      ) : (
                        item.ItemBarcode
                      )}
                    </td>
                  )}
                  <td className="border-b py-3 px-5">
                    {editRow === item.Id ? (
                      <input
                        type="text"
                        value={item.ShortName}
                        onChange={(e) => handleChange(e, item.Id, "ShortName")}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      item.ShortName
                    )}
                  </td>
                  <td className="border-b py-3 px-5">
                    {editRow === item.Id ? (
                      <input
                        type="text"
                        value={item.GenericName}
                        onChange={(e) =>
                          handleChange(e, item.Id, "GenericName")
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      item.GenericName
                    )}
                  </td>
                  <td className="border-b py-3 px-5">
                    {editRow === item.Id ? (
                      <input
                        type="number"
                        value={item.NumberOfPacket ?? ""}
                        onChange={(e) =>
                          handleChange(e, item.Id, "NumberOfPacket")
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      item.NumberOfPacket
                    )}
                  </td>

                  <td className="border-b py-3 px-5">
                    {editRow === item.Id ? (
                      <input
                        type="text"
                        value={item.ManufacturerDate}
                        onChange={(e) =>
                          handleChange(e, item.Id, "ManufacturerDate")
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      item.ManufacturerDate
                    )}
                  </td>
                  <td className="border-b py-3 px-5">
                    {editRow === item.Id ? (
                      <input
                        type="text"
                        value={item.ExpiryDate}
                        onChange={(e) => handleChange(e, item.Id, "ExpiryDate")}
                        className="border rounded px-2 py-1 w-full"
                        disabled={item.isContinued}
                      />
                    ) : (
                      item.ExpiryDate
                    )}
                  </td>
                  <td className="border-b py-3 px-5">
                    {editRow === item.Id ? (
                      <input
                        type="text"
                        value={item.BatchNumber}
                        onChange={(e) =>
                          handleChange(e, item.Id, "BatchNumber")
                        }
                        className="border rounded px-2 py-1 w-full"
                        disabled={item.isContinued}
                      />
                    ) : (
                      item.BatchNumber
                    )}
                  </td>

                  <td className="border-b py-3 px-5">
                    {editRow === item.Id ? (
                      <>
                        <button
                          onClick={() => handleSave(item.Id)}
                          className="mr-2 text-success"
                        >
                          <SaveRounded />
                        </button>
                        <button
                          onClick={() => handleCancel(item.Id)}
                          className="text-error"
                        >
                          <CancelRounded />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(item.Id)}
                          className="mr-2 text-success"
                        >
                          <EditRounded />
                        </button>

                        <button
                          onClick={() => handleDelete(item.Id)}
                          className="text-error"
                        >
                          <DeleteRounded />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hasScannedItems && (
        <div className="flex justify-end mt-4">
          <button
            className="border rounded-xl px-4 py-2 bg-success text-white"
            onClick={handleContinueMoreClick}
          >
            Continue More
          </button>
        </div>
      )}

      {showContinueOverlay && (
        <BulkCheckinOverlay
          onContinue={handleContinueYes}
          onCancel={handleContinueNo}
        />
      )}
    </>
  );
}
