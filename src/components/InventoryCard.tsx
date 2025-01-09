"use client";
import { InventoryCardPropsInterface } from "@/types/ComponentInterface";
import { WarningRounded } from "@mui/icons-material";

const InventoryCard: React.FC<InventoryCardPropsInterface> = ({
  inventory,
  descriptionId,
}) => {
  return (
    <table className="inventoryTable w-full text-text text-sm bg-gray-100 rounded-xl hover:bg-primary hover:text-black">
      <tbody>
        <tr
          className="tableRow cursor-pointer"
          title={`${inventory.Description}- ${inventory.BarCode}`}
          onClick={() =>
            (window.location.href = `/inventory/details/${descriptionId}/${inventory.Id}`)
          }
        >
          <td className="barcode font-bold  truncate  pl-14">
            {inventory.BarCode ? (
              <p>{inventory.BarCode}</p>
            ) : (
              <div className=" flex justify-center">
                <WarningRounded className="text-error" />
              </div>
            )}
          </td>
          <td className="batchNumber font-bold  truncate pl-32">
            {inventory.BatchNumber}
          </td>
          <td className="shortName text-text  truncate pl-24">
            {inventory.ShortName}
          </td>
          <td className="description font-bold truncate pl-10">
            {inventory.Description}
          </td>
          <td className="packSize text-text  truncate pl-2">
            {inventory.PackSize}
          </td>
          <td
            className={`expiration  truncate pr-28 ${
              !!inventory.ExpirationDate ? "text-text" : "text-error"
            }`}
          >
            {inventory.ExpirationDate || "NA"}
          </td>
          <td className="stock font-bold  text-center">{inventory.Quantity}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default InventoryCard;
