import BulkCheckinOverlay from "@/app/continuebulk/page";
import {
  DeleteRounded,
  EditRoadRounded,
  EditRounded,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Inventory {
  NumberOfPacket: number | null;
}

interface BulkCheckinProps {
  inventory: Inventory;
  onClose: () => void;
}

const RecieveBranchTransferOverlay: React.FC<BulkCheckinProps> = ({
  inventory,
  onClose,
}) => {
  const router = useRouter();
  const [isFinalBarcode, setIsFinalBarcode] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>("");
  const [scannedItems, setScannedItems] = useState<
    {
      barcode: string;
      serialNumber?: string;
      isEditing: boolean;
    }[]
  >([]);
  const [grossWeight, setGrossWeight] = useState<string>("");
  const [isWeightAdded, setIsWeightAdded] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const barcodeListRef = useRef<HTMLDivElement | null>(null);

  const hardcodedInventory = {
    Id: "12345",
    DescriptionId: "D123",
    Description: "Item Description",
    CategoryName: "Electronics",
    SerialNumber: "SN123456789",
  };
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
        toast.error("This barcode has already been scanned.");
      }

      setBarcode("");
      setIsFinalBarcode(false);
    }
  }, [isFinalBarcode, scannedItems, barcode]);

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

  const handleConfirmClick = async () => {
    setShowOverlay(true);
    console.log("Clicked");
  };

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div className="fixed w-1/2 min-h-72 top-20 right-1/2 translate-x-2/3 p-6 text-text rounded-3xl max-h-screen scrollbar-thin overflow-y-auto mt-4">
        <div className="w-full min-h-1 right-1/2 p-6 bg-white border border-tablehead rounded-xl">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Insert Shipper
            </h3>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-black text-primary text-left">
                Description: {""}
              </h1>
              <div className="flex flex-col justify-start items-end">
                <div className="px-4 py-2 rounded-xl border border-tablehead w-fit mb-2">
                  Total required: {inventory?.NumberOfPacket || 0}
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
                        <div className="flex gap-2"></div>
                        <button
                          onClick={() => handleDeleteItem(index)}
                          className="text-error"
                        >
                          <DeleteRounded />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
                  // disabled={
                  //   scannedItems.length !== (inventory?.NumberOfPacket || 0)
                  // }
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecieveBranchTransferOverlay;
