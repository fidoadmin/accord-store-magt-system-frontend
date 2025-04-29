"use client";

import BulkCheckinOverlay from "@/app/continuebulk/page";
import { useAddOrUpdateBulkCheckin } from "@/app/hooks/bulkcheckin/useBulkCheckinAddOrUpdate";
import { BulkCheckinInterface } from "@/types/BulkCheckin";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";

const authKey = getCookie("authKey") as string;

const BarcodeReaderPage = ({
  onClose,
  inventory,
}: {
  onClose: () => void;
  inventory: {
    // Id: string;
    // DescriptionId: string;
    // Description: string;
    // CategoryName: string;
    // SerialNumber: string;
  };
}) => {
  const [barcode, setBarcode] = useState<string>("");
  const [scannedItems, setScannedItems] = useState<
    {
      barcode: string;
      serialNumber?: string;
      isEditing: boolean;
    }[]
  >([]);
  const hardcodedInventory = {
    Id: "12345",
    DescriptionId: "D123",
    Description: "Item Description",
    CategoryName: "Electronics",
    SerialNumber: "SN123456789",
  };

  const hardcodedScannedItems = [
    { barcode: "barcode123", serialNumber: "SN123456789", isEditing: false },
    { barcode: "barcode124", serialNumber: "SN987654321", isEditing: false },
    { barcode: "barcode125", serialNumber: null, isEditing: true },
  ];
  const router = useRouter();
  const [isFinalBarcode, setIsFinalBarcode] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [isQuantityOverlayVisible, setIsQuantityOverlayVisible] =
    useState(true);
  const [isDetailsOverlayVisible, setIsDetailsOverlayVisible] = useState(false);
  const [editableBulkCheckin, setEditableBulkCheckin] =
    useState<BulkCheckinInterface | null>(null);
  const [editingCheckinId, setEditingCheckinId] = useState<string | null>(null);
  const [Bulk, setBulk] = useState<any[]>([]);
  const barcodeListRef = useRef<HTMLDivElement | null>(null);
  const { mutateAsync: addOrUpdateBulkCheckin } = useAddOrUpdateBulkCheckin();
  const [showOverlay, setShowOverlay] = useState(false);

  const [grossWeight, setGrossWeight] = useState("");
  const [isWeightAdded, setIsWeightAdded] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
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
          if (scannedItems.length === quantity) {
            toast.error("Cannot scan more than required quantity");
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
  }, [barcode]);

  useEffect(() => {
    if (isFinalBarcode && quantity != null) {
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
        toast.error("This barcode has already been scanned.");
      }

      setBarcode("");
      setIsFinalBarcode(false);
    }
  }, [isFinalBarcode, scannedItems, barcode, quantity]);

  const handleSerialNumberChange = (index: number, newSerialNumber: string) => {
    const updatedItems = [...scannedItems];
    updatedItems[index].serialNumber = newSerialNumber;
    setScannedItems(updatedItems);
    setBarcode("");
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = scannedItems.filter((_, i) => i !== index);

    setScannedItems(updatedItems);
    setBarcode("");
  };

  const handleEditItem = (index: number) => {
    const updatedItems = [...scannedItems];
    updatedItems[index].isEditing = !updatedItems[index].isEditing;
    setScannedItems(updatedItems);
    setIsEditing(true);
    setBarcode("");
  };

  const handleSaveItem = (index: number) => {
    const updatedItems = [...scannedItems];
    updatedItems[index].isEditing = false;
    setScannedItems(updatedItems);
    setIsEditing(false);
    setBarcode("");
  };

  const resetState = () => {
    setQuantity(0);
    setScannedItems([]);
    setIsDetailsVisible(false);
    setIsQuantityOverlayVisible(true);
    onClose();
    setBarcode("");
  };

  // const handleConfirmClick = async () => {
  //   const missingSerialNumber = scannedItems.some(
  //     (item) => inventory.SerialNumber && !item.serialNumber
  //   );
  //   if (missingSerialNumber) {
  //     toast.error("Please enter serial numbers for all items.");
  //     return;
  //   }

  //   const payload: BulkCheckinInterface = {
  //     Id: inventory.Id,
  //     BulkCheckin: scannedItems.map((entry) => ({
  //       BarCode: entry.barcode,
  //       SerialNumber: entry.serialNumber ? entry.serialNumber : null,
  //     })),
  //   };

  //   setBulk((prevBulk) =>
  //     prevBulk.map((bulk) =>
  //       bulk.Id === editingCheckinId
  //         ? { ...bulk, ...editableBulkCheckin }
  //         : bulk
  //     )
  //   );

  //   try {
  //     const result = await addOrUpdateBulkCheckin(payload);
  //     if (result) {
  //       setEditingCheckinId(null);
  //       setEditableBulkCheckin(editableBulkCheckin);
  //       toast.success("Bulk Checkin updated successfully!");
  //       router.push(`/inventory/details/${inventory.DescriptionId}`);
  //     }
  //   } catch (err) {}
  // };

  const handleQuantityConfirm = () => {
    setIsQuantityOverlayVisible(false);
    setIsDetailsOverlayVisible(true);
    setBarcode("");
  };

  const handleConfirmClick = async () => {
    setShowOverlay(true);
  };

  // const handleOverlayContinue = async () => {
  //   const missingSerialNumber = scannedItems.some(
  //     (item) => hardcodedInventory.SerialNumber && !item.serialNumber
  //   );
  //   if (missingSerialNumber) {
  //     toast.error("Please enter serial numbers for all items.");
  //     return;
  //   }

  //   const payload: BulkCheckinInterface = {
  //     Id: hardcodedInventory.Id,
  //     BulkCheckin: scannedItems.map((entry) => ({
  //       BarCode: entry.barcode,
  //       SerialNumber: entry.serialNumber ? entry.serialNumber : null,
  //     })),
  //   };

  //   try {
  //     const result = await addOrUpdateBulkCheckin(payload);
  //     if (result) {
  //       setEditingCheckinId(null);
  //       setEditableBulkCheckin(editableBulkCheckin);
  //       toast.success("Bulk Checkin updated successfully!");
  //       // router.push(`/inventory/details/${hardcodedInventory.DescriptionId}`);
  //     }
  //   } catch (err) {
  //     console.error("Error:", err);
  //     toast.error("An error occurred during the bulk check-in.");
  //   }
  //   setShowOverlay(false);
  // };

  const handleOverlayCancel = () => {
    router.push(`/inventory-details/${hardcodedInventory.DescriptionId}`);
    setShowOverlay(false);
  };

  const handleOverlayContinue = () => {
    router.push(`/checkin/${hardcodedInventory.DescriptionId}`);
    setShowOverlay(false);
  };
  const handleAddWeight = () => {
    if (grossWeight.trim() === "") {
      alert("Please enter a valid Gross Weight");
      return;
    }
    setIsWeightAdded(true);
  };

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div className="fixed w-1/2 min-h-72 top-20 right-1/2 translate-x-2/3 p-6  text-text rounded-3xl max-h-screen scrollbar-thin overflow-y-auto mt-4">
        {isQuantityOverlayVisible && (
          <div className="w-full min-h-1 right-1/2 p-6 bg-white border border-tablehead rounded-xl">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Enter Quantity for Bulk Check-in
              </h3>
              <input
                type="number"
                value={quantity || ""}
                onChange={(e) => {
                  setBarcode("");
                  setQuantity(Number(e.target.value));
                }}
                className="p-2 border border-tablehead rounded-xl w-full"
                placeholder="Enter Quantity"
              />
            </div>

            <div className="flex justify-between mt-2">
              <button
                onClick={resetState}
                className="bg-error text-white px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleQuantityConfirm}
                className="bg-success text-white px-4 py-2 rounded-xl"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {isDetailsOverlayVisible && (
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-screen-lg w-full">
            <h3 className="text-center text-2xl font-semibold mb-4 text-black">
              Insert Packet
            </h3>

            <div className="flex flex-col">
              <div className="flex flex-col justify-start items-end">
                <div className="px-4 py-2 rounded-xl border border-tablehead w-fit mb-2">
                  Total required: {quantity ? quantity : 0}
                </div>
              </div>
              <div className="flex flex-col justify-start items-end">
                <div className="px-4 py-2 rounded-xl border border-tablehead w-fit mb-2">
                  Total scanned: {scannedItems.length}
                </div>
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
                    onClick={handleConfirmClick}
                    className="bg-success text-white px-4 py-2 rounded-xl"
                    disabled={scannedItems.length != quantity}
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showOverlay && (
        <BulkCheckinOverlay
          onContinue={handleOverlayContinue}
          onCancel={handleOverlayCancel}
        />
      )}
    </div>
  );
};

export default BarcodeReaderPage;
