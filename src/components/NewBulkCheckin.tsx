"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { EditRounded, DeleteRounded } from "@mui/icons-material";

interface Inventory {
  NumberOfPacket: number | null;
}

interface ScannedItem {
  barcode: string;
  serialNumber?: string;
  isEditing: boolean;
}

interface BulkCheckinProps {
  inventory: Inventory;
  onClose: () => void;
  onConfirm: (items: ScannedItem[], grossWeight: string) => void;
}

const NewBulkCheckin: React.FC<BulkCheckinProps> = ({
  inventory,
  onClose,
  onConfirm,
}) => {
  const router = useRouter();
  const [isFinalBarcode, setIsFinalBarcode] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>("");
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [grossWeight, setGrossWeight] = useState<string>("");
  const [isWeightAdded, setIsWeightAdded] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number | null>(null);
  const barcodeListRef = useRef<HTMLDivElement | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA";

      if (isInputFocused) {
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        return;
      }

      if (
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key.startsWith("Arrow")
      ) {
        return;
      }

      if (/^[0-9a-zA-Z]$/.test(e.key)) {
        setBarcode((prev) => prev + e.key);

        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = await setTimeout(() => {
          if (scannedItems.length === inventory.NumberOfPacket) {
            alert("Cannot scan more than required quantity");
            setBarcode("");
            return;
          } else {
            setIsFinalBarcode(true);
          }
        }, 50);
      } else {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [barcode, inventory.NumberOfPacket, scannedItems.length]);

  useEffect(() => {
    if (isFinalBarcode) {
      if (!scannedItems.some((item) => item.barcode === barcode)) {
        const newItem = {
          barcode,
          isEditing: false,
        };

        setScannedItems((prev) => {
          const updatedItems = [...prev, newItem];
          setTimeout(() => {
            if (barcodeListRef.current) {
              const newItemElement = barcodeListRef.current.lastElementChild;
              if (newItemElement) {
                newItemElement.scrollIntoView({ behavior: "smooth" });
              }
            }
          }, 100);
          return updatedItems;
        });
      } else {
        alert("This barcode has already been scanned.");
      }

      setBarcode("");
      setIsFinalBarcode(false);
    }
  }, [isFinalBarcode, scannedItems, barcode]);

  const handleEditItem = (index: number) => {
    const updatedItems = [...scannedItems];
    updatedItems[index].isEditing = !updatedItems[index].isEditing;
    setScannedItems(updatedItems);
  };

  const handleSaveItem = (index: number) => {
    const updatedItems = [...scannedItems];
    updatedItems[index].isEditing = false;
    setScannedItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = scannedItems.filter((_, i) => i !== index);
    setScannedItems(updatedItems);
  };

  const resetState = () => {
    setQuantity(0);
    setScannedItems([]);
    onClose();
    setBarcode("");
  };

  const handleAddWeight = () => {
    if (grossWeight.trim() === "") {
      alert("Please enter a valid Gross Weight");
      return;
    }
    setIsWeightAdded(true);
  };

  const handleConfirm = () => {
    if (scannedItems.length === inventory.NumberOfPacket) {
      onConfirm(scannedItems, grossWeight);
      onClose();
    } else {
      alert(
        `Please scan exactly ${inventory.NumberOfPacket} items. Currently scanned: ${scannedItems.length}`
      );
    }
  };

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div className="fixed w-1/2 min-h-72 top-20 right-1/2 translate-x-2/3 p-6 text-text rounded-3xl max-h-screen scrollbar-thin overflow-y-auto mt-4">
        <div className="w-full min-h-1 right-1/2 p-6 bg-white border border-tablehead rounded-xl">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Insert Packet
            </h3>
            <div className="flex flex-col justify-start items-end">
              <div className="px-4 py-2 rounded-xl border border-tablehead w-fit mb-2">
                Total required: {inventory?.NumberOfPacket || 0}
              </div>
            </div>
            <div
              ref={barcodeListRef}
              className="w-full overflow-auto"
              style={{ maxHeight: "260px" }}
            >
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-2 bg-tablehead">
                    <th className="px-4 py-2 text-left text-black">SNo</th>
                    <th className="px-4 py-2 text-left text-black">Barcode</th>
                    <th className="px-4 py-2 text-left text-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scannedItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.barcode}</td>
                      <td className="px-4 py-2 flex justify-start gap-2">
                        <div className="flex gap-2">
                          {item.isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveItem(index)}
                                className="bg-success text-white px-4 py-2 rounded-xl"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => handleEditItem(index)}
                                className="bg-error text-white px-4 py-2 rounded-xl"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEditItem(index)}
                              className="text-success"
                            >
                              <EditRounded />
                            </button>
                          )}
                        </div>
                        {!item.isEditing && (
                          <button
                            onClick={() => handleDeleteItem(index)}
                            className="text-error"
                          >
                            <DeleteRounded />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {scannedItems.length > 0 && (
                <div className="flex gap-4 mt-4 items-center">
                  <input
                    type="text"
                    placeholder="Enter Gross Weight"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    className="border rounded-md px-4 py-2"
                  />
                  <button
                    onClick={handleAddWeight}
                    className="bg-success text-white px-4 py-2 rounded-xl"
                  >
                    Add Weight
                  </button>
                </div>
              )}

              {isWeightAdded && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={resetState}
                    className="bg-error text-white px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="bg-success text-white px-4 py-2 rounded-xl"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>

            {barcode && (
              <div className="mt-4 p-2 bg-gray-100 rounded">
                Scanning: {barcode}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              Scanned: {scannedItems.length} / {inventory?.NumberOfPacket || 0}{" "}
              items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBulkCheckin;
