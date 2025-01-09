"use client";
import { InventoryDetail } from "@/types/ReportInterface";

interface ReportCardProps {
  InventoryDetails: InventoryDetail[];
  customername: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  InventoryDetails,
  customername,
}) => {
  return (
    <div className="w-full mx-auto border-2 rounded-xl p-4 flex items-center justify-center">
      <p className="truncate w-1/5">{customername}</p>
      <div className="flex-1 flex flex-col space-y-2">
        {InventoryDetails.map((inventoryItem, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 border-b pb-2"
          >
            <div className="flex-1 text-center">
              <p
                className="truncate"
                title={inventoryItem.InventoryDescription}
              >
                {inventoryItem.ShortName}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p>{inventoryItem.Date}</p>
            </div>
            <div className="flex-1 text-center">
              <p>{inventoryItem.ExpirationDate}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="description font-bold">{inventoryItem.Quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportCard;
