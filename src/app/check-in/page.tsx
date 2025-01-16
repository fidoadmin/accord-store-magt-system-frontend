"use client";
import { useState, useRef, useEffect } from "react";
import {
  AddRounded,
  EditRounded,
  DeleteRounded,
  SaveRounded,
  CancelRounded,
} from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import NewBulkCheckin from "@/components/NewBulkCheckin";

export default function InventoryTable() {
  interface ScannedItem {
    isEditing: boolean;
    serialNumber?: string;
    barcode?: string;
  }
  const [addbutton, setAddButton] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [quantity, setQuantity] = useState<number | null>(null);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [isQuantityOverlayVisible, setIsQuantityOverlayVisible] =
    useState(false);
  const [showBulkInOverlay, setShowBulkCheckInOverlay] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  // const isCheckin = searchParams.get("isCheckin") === "true";
  const [isDetailsOverlayVisible, setIsDetailsOverlayVisible] = useState(false);
  const [isBarcodeTableVisible, setIsBarcodeTableVisible] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(true);

  const barcodeListRef = useRef(null);
  const barcodeInputRef = useRef<HTMLInputElement | null>(null);

  interface Item {
    Id: number;
    BarCode: string;
    ShortName: string;
    GenericName: string;
    NumberOfPacket: number | null;
    ManufacturerDate: string;
    ExpiryDate: string;
    BatchNumber: string;
    GrossWeight: string;
  }

  const initialData: Item[] = [
    {
      Id: 1,
      BarCode: "",
      ShortName: "",
      GenericName: "",
      NumberOfPacket: null,
      ManufacturerDate: "",
      ExpiryDate: "",
      BatchNumber: "",
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
  const handleOverlayClose = () => setAddButton(false);
  const handleDeleteItem = (index: any) => {
    setScannedItems(scannedItems.filter((_, i) => i !== index));
  };

  const handleOverlayToggle = () => {
    setShowBulkCheckInOverlay(!showBulkInOverlay);
  };
  const resetState = () => {
    console.log("Resetting state...");
    setQuantity(null);
    setIsQuantityOverlayVisible(false);
    setIsBarcodeTableVisible(false);
    setAddButton(false);
  };

  const handleQuantityConfirm = () => {
    if (quantity && quantity > 0) {
      setIsQuantityOverlayVisible(false);
      setIsBarcodeTableVisible(true);
      barcodeInputRef.current?.focus();
    } else {
      alert("Please enter a valid quantity.");
    }
  };

  const handleBarcodeScan = (event: React.ChangeEvent<HTMLInputElement>) => {
    const barcode = event.target.value.trim();

    if (barcode) {
      setScannedItems((prev) => [...prev, { barcode, isEditing: false }]);
      event.target.value = "";
    }
  };

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

    if (field === "NumberOfPacket") {
      setQuantity(e.target.value);
    }
  };
  useEffect(() => {
    const allPacketsEntered = data.every(
      (item) => item.NumberOfPacket && item.NumberOfPacket > 0
    );
    setIsAddDisabled(!allPacketsEntered);
  }, [data]);

  return (
    <>
      <div className="text-4xl">Shipper-Checkin</div>
      <div className="relative w-full">
        <div className="py-1 flex justify-end mb-8">
          <button
            className="btn bg-success rounded-xl px-4 py-2 text-white flex items-center md:justify-around mb-6 disabled:opacity-40 : "
            type="button"
            onClick={handleOverlayToggle}
            title="Bulk Scan"
            disabled={isAddDisabled}
          >
            Add
            <span className="hidden group-hover:inline pr-2">Add</span>
            <AddRounded />
          </button>

          {showBulkInOverlay && (
            <NewBulkCheckin
              onClose={handleOverlayToggle}
              inventory={{
                NumberOfPacket: data[0].NumberOfPacket,
              }}
            />
          )}
        </div>

        <div className="overflow-x-fixed border-2 rounded-lg relative top-[-40px]">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="border-b-2 text-left">
                <th className="cursor-pointer text-left border-b py-3 px-5 text-sm">
                  Barcode
                </th>
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
                      />
                    ) : (
                      item.BarCode
                    )}
                  </td>
                  <td className="border-b py-3 px-5">
                    {editRow === item.Id ? (
                      <input
                        type="text"
                        value={item.ShortName}
                        onChange={(e) => handleChange(e, item.Id, "ShortName")}
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
                      />
                    ) : (
                      item.GenericName
                    )}
                  </td>
                  <td className="border-b py-3 px-5">
                    {editRow === item.Id ? (
                      <input
                        type="text"
                        value={item.NumberOfPacket ?? ""}
                        onChange={(e) =>
                          handleChange(e, item.Id, "NumberOfPacket")
                        }
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
    </>
  );
}
