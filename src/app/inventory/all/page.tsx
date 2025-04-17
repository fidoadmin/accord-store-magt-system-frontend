"use client";

import React, { useState } from "react";

const NewReport = () => {
  const hardcodedData = [
    {
      checkoutnumber: "C12345",
      challannumber: "CH001",
      from: "Warehouse A",
      to: "Store B",
      statusname: "Completed",
      checkouttypename: "Standard",
      created: "2025-01-20",
      checkoutstartedby: "Poshan",
      checkoutcompletedby: "Poshan",
    },
    {
      checkoutnumber: "C12346",
      challannumber: "CH002",
      from: "Warehouse B",
      to: "Store C",
      statusname: "In Progress",
      checkouttypename: "Express",
      created: "2025-01-19",
      checkoutstartedby: "Alice Johnson",
      checkoutcompletedby: "Poshan",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
    {
      checkoutnumber: "C12347",
      challannumber: "CH003",
      from: "Warehouse C",
      to: "Store A",
      statusname: "Pending",
      checkouttypename: "Bulk",
      created: "2025-01-18",
      checkoutstartedby: "Bob Brown",
      checkoutcompletedby: "Test",
    },
  ];

  const [sortby, setSortBy] = useState("");
  const [sortorder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortby === key) {
      setSortOrder(sortorder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const sortedData = [...hardcodedData].sort((a, b) => {
    const valueA = a[sortby as keyof typeof a]?.toString() || "";
    const valueB = b[sortby as keyof typeof b]?.toString() || "";
    if (sortorder === "asc") {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  return (
    <div className="p-2">
      <div className="overflow-x-auto">
        <div className="tableHeader flex justify-between items-center p-1 bg-tablehead border font-bold rounded-lg text-sm">
          <p
            className="w-1/6 text-left cursor-pointer text-xs"
            onClick={() => handleSort("checkoutnumber")}
          >
            Checkout No
            {sortby === "checkoutnumber" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-left cursor-pointer text-xs"
            onClick={() => handleSort("challannumber")}
          >
            Challan No
            {sortby === "challannumber" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-left cursor-pointer text-xs"
            onClick={() => handleSort("from")}
          >
            From
            {sortby === "from" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-left cursor-pointer text-xs"
            onClick={() => handleSort("to")}
          >
            To
            {sortby === "to" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-left cursor-pointer text-xs"
            onClick={() => handleSort("statusname")}
          >
            Status
            {sortby === "statusname" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-left cursor-pointer text-xs"
            onClick={() => handleSort("checkouttypename")}
          >
            Type
            {sortby === "checkouttypename" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-left cursor-pointer text-xs"
            onClick={() => handleSort("created")}
          >
            Date
            {sortby === "created" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-left cursor-pointer text-xs pr-6"
            onClick={() => handleSort("checkoutstartedby")}
          >
            Initiated By
            {sortby === "checkoutstartedby" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-center cursor-pointer text-xs pr-6 pl-2"
            onClick={() => handleSort("checkoutcompletedby")}
          >
            Completed By
            {sortby === "checkoutcompletedby" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p className="w-1/6 text-center">Actions</p>
        </div>

        <div className="dataRows">
          {sortedData.map((item, index) => (
            <div
              key={index}
              className="tableRow flex justify-between items-center text-xs border-2 hover:bg-gray-100"
            >
              <p className="w-1/6 text-left">{item.checkoutnumber}</p>
              <p className="w-1/6 text-left">{item.challannumber}</p>
              <p className="w-1/6 text-left">{item.from}</p>
              <p className="w-1/6 text-left">{item.to}</p>
              <p className="w-1/6 text-left">{item.statusname}</p>
              <p className="w-1/6 text-left">{item.checkouttypename}</p>
              <p className="w-1/6 text-left">{item.created}</p>
              <p className="w-1/6 text-left">{item.checkoutstartedby}</p>
              <p className="w-1/6 text-center">
                {item.checkoutcompletedby || "N/A"}
              </p>
              <div className="w-1/6 p-1 text-center flex justify-around gap-1">
                <button
                  className="bg-primary text-white rounded-xl cursor-pointer hover:opacity-40 px-1 py-1 underline"
                  onClick={() => console.log("View Details clicked", item)}
                >
                  Detail
                </button>
                <button
                  className=" bg-primary text-white rounded-xl cursor-pointer hover:opacity-40 px-1 py-1 underline"
                  onClick={() => console.log("Mark as Returned clicked", item)}
                >
                  Return
                </button>
                <button
                  className=" bg-primary text-white rounded-xl cursor-pointer hover:opacity-40 px-1 py-1 underline"
                  onClick={() => console.log("Invoice Details clicked", item)}
                >
                  Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewReport;

// "use client";
// import { getCookie } from "cookies-next";
// import { useEffect, useState } from "react";
// import TableHeader from "@/components/TableHeader";
// import DescriptionCard from "@/components/DescriptionCard";
// import SearchInput from "@/components/SearchBox";
// import "react-datepicker/dist/react-datepicker.css";
// import Pagination from "@/components/Pagination";
// import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
// import { InventoryDescriptionInterface } from "@/types/InventoryInterface";
// import Loading from "@/app/loading";
// import DatePicker from "react-datepicker";
// import { useInventoryDescriptionForMaintenance } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionForMaintenance";

// export default function AllInventory() {
//   const authKey = getCookie("authKey") as string;
//   const [page, setPage] = useState<number>(1);
//   const [limit, setLimit] = useState<number>(10);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const [selectedOption, setSelectedOption] = useState("InStock");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const [fromDate, setFromDate] = useState<string>("");
//   const [toDate, setToDate] = useState<string>("");
//   const [hasModelName, setHasModelName] = useState<boolean>(false);
//   const [hasPartNumber, setHasPartNumber] = useState<boolean>(false);
//   const [localInventoryDescriptionList, setLocalInventoryDescriptionList] =
//     useState<InventoryDescriptionInterface[] | null>(null);
//   const [sortby, setSortBy] = useState<string>("modified");
//   const [sortorder, setSortOrder] = useState<"asc" | "desc">("desc");

//   const {
//     data: categoryList,
//     error: categoriesError,
//     isLoading: categoriesLoading,
//   } = useCategoryList(authKey, {
//     page: 1,
//   });

//   const {
//     data: inventoryDescriptionList,
//     error: inventoryDescriptionError,
//     isLoading: inventoryDescriptionLoading,
//   } = useInventoryDescriptionForMaintenance(authKey, {
//     page: page,
//     limit: limit,
//     search: searchTerm,
//     categoryId: selectedCategory,
//     varsortby: sortby,
//     varsortorder: sortorder,
//     fromDate: fromDate,
//     toDate: toDate,
//     isFromReport: true,
//     outofstock: selectedOption === "OutofStock",
//     instock: selectedOption === "InStock",
//   });

//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm]);

//   const handleOptionChange = (value: string) => {
//     setLocalInventoryDescriptionList(null);
//     setSelectedOption(value);
//     setSelectedCategory("");
//     setToDate("");
//     setFromDate("");
//   };
//   const categories = Array.isArray(categoryList)
//     ? categoryList
//     : categoryList?.data || [];

//   const handleSetOpenDropdown = (dropdownId: string) => {
//     setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
//   };

//   const handleSelectCategory = (option: { id: string; name: string }) => {
//     setSelectedCategory(option.id);
//   };

//   const handleSortChange = (column: string) => {
//     const order = sortby === column && sortorder === "asc" ? "desc" : "asc";
//     setSortBy(column);
//     setSortOrder(order);
//   };

//   const handleDateFromSelect = (date: Date | null) => {
//     setFromDate(date ? formatDate(date) : "");
//   };

//   const handleDateToSelect = (date: Date | null) => {
//     setToDate(date ? formatDate(date) : "");
//   };

//   const formatDate = (date: Date) =>
//     date.getFullYear() +
//     "-" +
//     (date.getMonth() + 1).toString().padStart(2, "0") +
//     "-" +
//     date.getDate().toString().padStart(2, "0");

//   if (inventoryDescriptionError) {
//     return <Loading />;
//   }

//   const inventoryData =
//     localInventoryDescriptionList ?? inventoryDescriptionList?.data;

//   return (
//     <>
//       <div className="mt-10 text-xl font-semibold">
//         Inventory <span className="mx-2"> &gt; </span>
//         <h1 className="pl-32 mt-[-29px] truncate">
//           {selectedOption === "InStock"
//             ? "In Stock Inventory"
//             : selectedOption === "OutofStock"
//             ? "Out of Stock Inventory"
//             : "All Inventory"}
//         </h1>
//       </div>

//       <div className="inventoryList mt-6 w-full max-w-full overflow-hidden">
//         <div className="flex justify-between md:flex-row items-center">
//           <select
//             className="w-96 px-4 py-2 border rounded-xl"
//             value={selectedOption}
//             onChange={(e) => handleOptionChange(e.target.value)}
//           >
//             <option value="InStock" className="text-center">
//               In Stock
//             </option>
//             <option value="OutofStock" className="text-center">
//               Out of Stock
//             </option>
//             <option value="All" className="text-center">
//               All
//             </option>
//           </select>

//           <div className="w-auto pl-10">
//             <select
//               className="w-50 px-4 py-2 border rounded-xl"
//               value={selectedCategory}
//               onChange={(e) =>
//                 handleSelectCategory({
//                   id: e.target.value,
//                   name: e.target.options[e.target.selectedIndex].text,
//                 })
//               }
//             >
//               <option value="" className="text-center" disabled>
//                 Categories
//               </option>
//               {categories.map((category) => (
//                 <option
//                   key={category.Id}
//                   value={category.Id}
//                   className="text-center"
//                 >
//                   {category.Name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="w-full flex items-center gap-4 mb-1 pl-8">
//             <div className="w-auto">
//               <DatePicker
//                 id="date-from"
//                 dateFormat="yyyy-MM-dd"
//                 placeholderText="Date From"
//                 selected={fromDate ? new Date(fromDate) : null}
//                 onChange={handleDateFromSelect}
//                 isClearable
//                 className="w-full p-2 border border-gray-300 rounded-xl"
//               />
//             </div>

//             <div className="w-auto">
//               <DatePicker
//                 id="date-to"
//                 dateFormat="yyyy-MM-dd"
//                 placeholderText="Date To"
//                 selected={toDate ? new Date(toDate) : null}
//                 onChange={handleDateToSelect}
//                 isClearable
//                 className="w-full p-2 border border-gray-300 rounded-xl"
//               />
//             </div>

//             <div className="w-auto">
//               <SearchInput
//                 searchTerm={searchTerm}
//                 setSearchTerm={setSearchTerm}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 table-fixed">
//         {inventoryData?.length ? (
//           <TableHeader
//             tableTitle="Description"
//             handleSortChange={handleSortChange}
//             sortby={sortby}
//             sortorder={sortorder}
//           />
//         ) : (
//           !searchTerm.length && (
//             <div>
//               <h1 className="text-error text-xl text-center">
//                 No Inventory Found
//               </h1>
//             </div>
//           )
//         )}
//         {inventoryData?.length ? (
//           <>
//             <ul className="flex flex-col gap-1">
//               {inventoryData.map((inventory, index) => (
//                 <DescriptionCard key={index} description={inventory} />
//               ))}
//             </ul>
//             <Pagination
//               currentPage={page}
//               totalPages={Math.ceil(
//                 (inventoryDescriptionList?.totalCount
//                   ? inventoryDescriptionList?.totalCount
//                   : 0) / limit
//               )}
//               onPageChange={(page) => setPage(page)}
//             />
//           </>
//         ) : (
//           !!searchTerm.length && (
//             <p className="text-error font-bold text-center">
//               Could not find the inventory you are looking for!
//             </p>
//           )
//         )}
//       </div>
//     </>
//   );
// }
