"use client";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";

const CheckInPage = () => {
  const [inventoryData, setInventoryData] = useState<any>(null);

  useEffect(() => {
    const hardcodedData = {
      DescriptionId: "D123",
      items: [
        {
          barcode: "",
          shortName: "",
          genericName: "",
          noOfPacket: "",
          manufacturerDate: "",
          expiryDate: "2024-01-01",
          batchNo: "B12345",
        },
        {
          barcode: "",
          shortName: "",
          genericName: "",
          noOfPacket: "",
          manufacturerDate: "",
          expiryDate: "2024-02-01",
          batchNo: "B12346",
        },
      ],
    };
    setInventoryData(hardcodedData);
  }, []);

  if (!inventoryData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container p-4">
      <h2 className="text-lg font-bold mb-4">Confirm Check-in</h2>
      <table className="min-w-full border-collapse table-auto">
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
          {inventoryData.items.map((item: any, index: any) => (
            <tr key={index} className="text-left">
              <td className="border-b py-3 px-5">{item.barcode}</td>
              <td className="border-b py-3 px-5">{item.shortName}</td>
              <td className="border-b py-3 px-5">{item.genericName}</td>
              <td className="border-b py-3 px-5">{item.noOfPacket}</td>
              <td className="border-b py-3 px-5">{item.manufacturerDate}</td>
              <td className="border-b py-3 px-5">{item.expiryDate}</td>
              <td className="border-b py-3 px-5">{item.batchNo}</td>
              <td className="border-b py-3 px-5">
                <button className="mr-2 text-success">
                  <EditRounded />
                </button>

                <button className="text-error">
                  <DeleteRounded />
                </button>
                {/* <button className="bg-success text-white px-3 py-2 rounded-lg">
                  Confirm
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckInPage;
