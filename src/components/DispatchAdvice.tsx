"use client";

import type React from "react";
import { useState } from "react";

export default function DispatchForm() {
  const [items, setItems] = useState([
    {
      sn: 1,
      caseNo: "",
      productDescription: "",
      pack: "",
      batchNo: "",
      invQty: "",
      schQty: "",
      totalQty: "",
      mrp: "",
      exp: "",
      noOfCase: "",
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        sn: items.length + 1,
        caseNo: "",
        productDescription: "",
        pack: "",
        batchNo: "",
        invQty: "",
        schQty: "",
        totalQty: "",
        mrp: "",
        exp: "",
        noOfCase: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      sn: idx + 1,
    }));
    setItems(updatedItems);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", {
      items,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white  rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-2">
        <div className="flex items-center mb-1">
          <div className="mr-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 5L5 20L20 35L35 20L20 5Z"
                stroke="#333"
                strokeWidth="2"
                fill="none"
              />
              <path d="M20 15L15 20L20 25L25 20L20 15Z" fill="#333" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">
              Accord Pharmaceuticals Ltd.
            </h1>
          </div>
        </div>
        <p className="text-xs text-center text-gray-600">
          Corporate Office:186-Milan Basti Marg, Subidhanagar, Tinkune,
          Kathmandu-32, Nepal.
        </p>
        <p className="text-xs text-center text-gray-600">
          Phone No. +977-1- 4111836, 4111539
        </p>
      </div>

      <h2 className="text-lg font-bold text-center border-b-2 border-t-2 py-1 mb-4">
        DISPATCH ADVICE
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <div className="border border-gray-300">
            <div className="flex flex-wrap sm:flex-nowrap">
              <label className="w-full sm:w-1/3 text-sm p-1 font-medium">
                Dispatch Adv. No.:
              </label>
              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                <input className="w-full h-full p-1 text-sm border-none focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="flex flex-wrap sm:flex-nowrap">
              <label className="w-full sm:w-1/3 text-sm p-1 font-medium">
                Date:
              </label>
              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                <input className="w-full h-full p-1 text-sm border-none focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="flex flex-wrap sm:flex-nowrap">
              <label className="w-full sm:w-1/3 text-sm p-1 font-medium">
                Distributor Name:
              </label>
              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                <input className="w-full h-full p-1 text-sm border-none focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="flex flex-wrap sm:flex-nowrap">
              <label className="w-full sm:w-1/3 text-sm p-1 font-medium">
                Invoice No.:
              </label>
              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                <input className="w-full h-full p-1 text-sm border-none focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="flex flex-wrap sm:flex-nowrap">
              <label className="w-full sm:w-1/3 text-sm p-1 font-medium">
                Distributor Address:
              </label>
              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                <input className="w-full h-full p-1 text-sm border-none focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="flex flex-wrap sm:flex-nowrap">
              <label className="w-full sm:w-1/3 text-sm p-1 font-medium">
                Transport Name:
              </label>
              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                <input className="w-full h-full p-1 text-sm border-none focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="flex flex-wrap sm:flex-nowrap">
              <label className="w-full sm:w-1/3 text-sm p-1 font-medium">
                VAT/PAN:
              </label>
              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                <input className="w-full h-full p-1 text-sm border-none focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="flex flex-wrap sm:flex-nowrap">
              <label className="w-full sm:w-1/3 text-sm p-1 font-medium">
                CN. No.:
              </label>
              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                <input className="w-full h-full p-1 text-sm border-none focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="flex flex-wrap sm:flex-nowrap">
              <label className="w-full sm:w-1/3 text-sm p-1 font-medium">
                No. of Cases:
              </label>
              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                <input className="w-full h-full p-1 text-sm border-none focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="flex flex-wrap sm:flex-nowrap">
              <label className="w-full sm:w-1/3 text-sm p-1 font-medium">
                Delivered By:
              </label>
              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                <input className="w-full h-full p-1 text-sm border-none focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm mb-2">
          Please dispatch the following goods / materials to the above party at
          an earliest.
        </p>

        <div className="mb-4 overflow-hidden">
          <div className="w-full overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse border border-gray-300 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-1 text-center">
                    S.N.
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    CASE NO.
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    PRODUCT DESCRIPTION
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    PACK
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    BATCH NO
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    INV QTY.
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    SCH. QTY.
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    TOTAL QTY.
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    MRP
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    EXP.
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    NO. OF CASE
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-1 text-center">
                      {item.sn}
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        value={item.caseNo}
                        onChange={(e) =>
                          handleItemChange(index, "caseNo", e.target.value)
                        }
                        className="w-full h-6 text-xs border-none focus:outline-none p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        value={item.productDescription}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "productDescription",
                            e.target.value
                          )
                        }
                        className="w-full h-6 text-xs border-none focus:outline-none p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        value={item.pack}
                        onChange={(e) =>
                          handleItemChange(index, "pack", e.target.value)
                        }
                        className="w-full h-6 text-xs border-none focus:outline-none p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        value={item.batchNo}
                        onChange={(e) =>
                          handleItemChange(index, "batchNo", e.target.value)
                        }
                        className="w-full h-6 text-xs border-none focus:outline-none p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        value={item.invQty}
                        onChange={(e) =>
                          handleItemChange(index, "invQty", e.target.value)
                        }
                        className="w-full h-6 text-xs border-none focus:outline-none p-1"
                        type="number"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        value={item.schQty}
                        onChange={(e) =>
                          handleItemChange(index, "schQty", e.target.value)
                        }
                        className="w-full h-6 text-xs border-none focus:outline-none p-1"
                        type="number"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        value={item.totalQty}
                        onChange={(e) =>
                          handleItemChange(index, "totalQty", e.target.value)
                        }
                        className="w-full h-6 text-xs border-none focus:outline-none p-1"
                        type="number"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        value={item.mrp}
                        onChange={(e) =>
                          handleItemChange(index, "mrp", e.target.value)
                        }
                        className="w-full h-6 text-xs border-none focus:outline-none p-1"
                        type="number"
                      />
                    </td>
                    <td className="border border-gray-300 p-0"></td>
                    <td className="border border-gray-300 p-0">
                      <input
                        value={item.noOfCase}
                        onChange={(e) =>
                          handleItemChange(index, "noOfCase", e.target.value)
                        }
                        className="w-full h-6 text-xs border-none focus:outline-none p-1"
                        type="number"
                      />
                    </td>
                  </tr>
                ))}

                {Array.from({ length: Math.min(10, 20 - items.length) }).map(
                  (_, index) => (
                    <tr key={`empty-${index}`}>
                      <td className="border border-gray-300 p-1 text-center">
                        {items.length + index + 1}
                      </td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1"></td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-4 text-xs">
          <div className="p-1 text-center">
            <p className="font-medium mb-1">Prepared by</p>
            <p className="text-xs">(Commerce)</p>
          </div>
          <div className="p-1 text-center">
            <p className="font-medium mb-1">Packed by</p>
            <p className="text-xs">(Store)</p>
          </div>
          <div className="p-1 text-center">
            <p className="font-medium mb-1">Billed by</p>
            <p className="text-xs">(Commerce)</p>
          </div>
          <div className="p-1 text-center">
            <p className="font-medium mb-1">Verified by</p>
            <p className="text-xs">(Store)</p>
          </div>
          <div className="p-1 text-center">
            <p className="font-medium mb-1">Approved by</p>
            <p className="text-xs">(HOD)</p>
          </div>
        </div>

        <div className="mb-4 text-xs">
          <div className="flex flex-wrap items-center mb-1">
            <div className="mr-1">1.</div>
            <div className="flex flex-wrap items-center">
              <span className="mr-1">
                Received the invoice receipt copy by account dept.
              </span>
              <div className="border border-gray-300 w-8 h-5"></div>
            </div>
          </div>
          <div className="flex flex-wrap items-center mb-2">
            <div className="mr-1">2.</div>
            <div className="flex flex-wrap items-center">
              <span className="mr-1">
                Received the invoice copy with L.R. copy of transport by account
                dept.
              </span>
              <div className="border border-gray-300 w-8 h-5"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label className="mr-1">Signature:</label>
              <div className="border-b border-gray-400 flex-grow"></div>
            </div>
            <div className="flex items-center">
              <label className="mr-1">Date:</label>
              <div className="border-b border-gray-400 flex-grow"></div>
            </div>
          </div>
        </div>
        <div className="print:hidden flex justify-between"></div>
      </form>
    </div>
  );
}
