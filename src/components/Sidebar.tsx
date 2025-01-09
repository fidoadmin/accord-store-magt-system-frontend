"use client";

import Link from "next/link";
import { getCookie } from "cookies-next";
import {
  SummarizeRounded,
  InventoryRounded,
  OutboxRounded,
  MoveToInboxRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  MenuRounded,
  MenuOpenRounded,
  AdjustRounded,
  HandymanRounded,
  QrCode2Rounded,
  DashboardRounded,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";
import {
  SidebarSectionInterface,
  SidebarSubsectionInterface,
} from "@/types/ComponentInterface";
import React from "react";
import { useLogin } from "@/app/hooks/auth/useLogin";

const sections: SidebarSectionInterface[] = [
  { title: "Dashboard", id: 1, href: "/dashboard", icon: DashboardRounded },
  // {
  //   title: "Inventory",
  //   id: 2,
  //   href: "/inventory",
  //   icon: InventoryRounded,
  //   subItems: [
  //     { title: "All", id: "all", href: "/inventory/all" },
  //     {
  //       title: "Out of Stock",
  //       id: "outofstock",
  //       href: "/inventory/out-of-stock",
  //     },
  //   ],
  // },
  { title: "Check-in", id: 3, href: "/check-in", icon: MoveToInboxRounded },
  // {
  //   title: "Checkout",
  //   id: 4,
  //   href: "",
  //   icon: OutboxRounded,
  //   subItems: [
  //     { title: "Sales Checkout", id: "salescheckout", href: "/checkout" },
  //     {
  //       title: "Branch Transfer",
  //       id: "branchtransfer",
  //       href: "/branchtransfer",
  //     },
  //     {
  //       title: "In Progress ",
  //       id: "inprogress",
  //       href: "/checkoutlist",
  //     },
  //     {
  //       title: "Return",
  //       id: "return",
  //       href: "/return",
  //     },
  //   ],
  // },
  // {
  //   title: "Maintenance",
  //   id: 5,
  //   href: "/maintenance",
  //   icon: HandymanRounded,
  // },
  {
    title: "Maintenance",
    id: 5,
    href: "",
    icon: HandymanRounded,
    subItems: [
      {
        title: "System",
        id: "systemlist",
        href: "/maintenance/system-maintenance",
      },
      {
        title: "User",
        id: "userlist",
        href: "/maintenance/usermaintenance",
      },
    ],
  },
  // {
  //   title: "Generate Barcode",
  //   id: 6,
  //   href: "/generatebarcode",
  //   icon: QrCode2Rounded,
  // },
  // {
  //   title: "Reports",
  //   id: 7,
  //   href: "",
  //   icon: SummarizeRounded,
  //   subItems: [
  //     {
  //       title: "Inventory",
  //       id: "inventory",
  //       href: "/report/inventory",
  //     },
  //     {
  //       title: "Checkout",
  //       id: "checkoutreport",
  //       href: "/report/checkout",
  //     },
  // subItems: [
  // { title: "In Stock", id: "all", href: "/inventory/all" },
  // {
  //   title: "Out of Stock",
  //   id: "outofstock",
  //   href: "/inventory/out-of-stock",
  // },
  // {
  //   title: "Checkout",
  //   id: "branchtransfer",
  //   href: "/report/checkoutreport",
  // },
  // ],
  //   ],
  // },
  // {
  //   title: "Inventory Report",
  //   id: 8,
  //   href: "",
  //   icon: SummarizeRounded,
  //   subItems: [
  //     { title: "In Stock", id: "all", href: "/inventory/all" },
  //     {
  //       title: "Out of Stock",
  //       id: "outofstock",
  //       href: "/inventory/out-of-stock",
  //     },
  //     {
  //       title: "Checkout Report",
  //       id: "branchtransfer",
  //       href: "/report/checkoutreport",
  //     },
  //   ],
  // },
];
// const staticSubItems = [
//   { title: "All", href: "/inventory/all" },
//   { title: "Out of Stock", href: "/inventory/out-of-stock" },
// ];

export default function Sidebar() {
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [category, setCategory] = useState<{ name?: string; id?: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ClientName, setClientName] = useState<string | null>(null);
  const [FirstName, setFirstName] = useState<string | null>(null);
  const [LastName, setLastName] = useState<string | null>(null);
  const itemsPerPage = 20;
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    const key = getCookie("authKey") as string;
    const firstname = getCookie("firstName") as string;
    const lastname = getCookie("lastName") as string;
    const name = getCookie("ClientName") as string;

    setAuthKey(key);
    setFirstName(firstname);
    setLastName(lastname);
    setClientName(name);
  }, []);

  // const {
  //   data: categoryList,
  //   error: categoriesError,
  //   isLoading: categoriesLoading,
  // } = useCategoryList(authKey || "", {
  //   // Second argument (options)
  //   page: currentPage, // Set the current page for pagination
  //   limit: itemsPerPage, // Set items per page
  //   categoryId: category?.id || "", // Safely handle categoryId
  // });

  // const InventorySubsections: SidebarSubsectionInterface[] =
  //   categoryList?.map((item) => ({
  //     title: item.Name,
  //     id: item.Id,
  //     href: `/inventory/${item.Id}`,
  //   })) || [];

  // sections[1].subItems = InventorySubsections;

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const matchedSection = sections.find((section) =>
      pathname.startsWith(section.href)
    );
    if (matchedSection) {
      setExpandedSection(matchedSection.id);
    } else {
      setExpandedSection(null);
    }
  }, [pathname]);

  const subsectionToggle = (
    id: number,
    hasSubItems: boolean,
    event: React.MouseEvent
  ) => {
    if (hasSubItems) {
      event.preventDefault();
      setExpandedSection(expandedSection === id ? null : id);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sectionItems = sections.map((section) => (
    <li
      key={section.id}
      className={`w-full ${
        pathname.includes(section.href) ? "text-primary" : ""
      }`}
    >
      <Link
        href={section.href}
        className={`w-full flex items-center py-4 px-4 hover:text-secondary cursor-pointer`}
      >
        <span className={`${sidebarOpen ? "mr-4 ml-8" : "mx-auto"}`}>
          <section.icon />
        </span>
        <h1 className={`${sidebarOpen ? "" : "hidden"}`}>{section.title}</h1>
        {section.subItems && (
          <span
            onClick={(e) => subsectionToggle(section.id, !!section.subItems, e)}
            className={`ml-auto hover:bg-background hover:rounded-full ${
              sidebarOpen ? "" : "hidden"
            }`}
          >
            {expandedSection === section.id ? (
              <KeyboardArrowUpRounded />
            ) : (
              <KeyboardArrowDownRounded />
            )}
          </span>
        )}
      </Link>
      {/* For Inventory's static subsection buttons */}
      {/* {section.id === 2 && (
        <ul
          className={`text-sm text-secondary flex gap-2 justify-between ${
            sidebarOpen ? "px-10 py-1" : "hidden"
          }`}
        >
          {staticSubItems.map((item) => (
            <li
              key={item.href}
              // className={`py-2 text-white hover:opacity-80 rounded-xl px-4 flex items-center justify-center text-center ${
              className={` ${
                // item.title.toLowerCase() === "all" ? "bg-success" : "bg-error"
                item.title.toLowerCase() === "all" ? "" : ""
              }`}
            >
              <Link href={item.href} className={`flex items-center`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )} */}
      {/* {section.id === 2 && (
        <ul
          className={`text-sm text-secondary flex flex-col gap-2 justify-between ${
            sidebarOpen ? "px-10 py-1" : "hidden"
          }`}
        >
          {section.subItems?.map((item) => (
            <li
              key={item.id}
              className={`py-2 text-white hover:opacity-80 rounded-xl px-4 flex items-center justify-center text-center ${
                item.title.toLowerCase() === "all" ? "bg-success" : "bg-error"
              }`}
            >
              <Link href={item.href} className="flex items-center">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )} */}
      {expandedSection === section.id &&
        section.subItems?.some((item) => item.subItems?.length) && (
          <ul
            className={`bg-surface max-h-40 overflow-y-scroll scrollbar-thin scrollbar-track-primary scrollbar-thumb-secondary text-sm text-secondary ${
              sidebarOpen ? "pl-16" : "hidden"
            }`}
          >
            {section.subItems.map((item) =>
              item.subItems?.map((subItem) => (
                <li
                  key={subItem.id}
                  className="py-2 text-text hover:text-success"
                >
                  <Link
                    href={subItem.href}
                    className={`flex items-center ${
                      pathname.includes(subItem.id) ? "text-primary" : ""
                    } ${sidebarOpen ? "" : "justify-center"}`}
                  >
                    <h1 className={`${sidebarOpen ? "" : "hidden"}`}>
                      {subItem.title}
                    </h1>
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}

      {expandedSection === section.id && section.subItems && (
        <ul
          className={`bg-surface max-h-40 overflow-y-scroll scrollbar-thin scrollbar-track-primary scrollbar-thumb-secondary text-sm text-secondary ${
            sidebarOpen ? "pl-16" : "hidden"
          }`}
        >
          {section.subItems.map((subItem) => (
            <li key={subItem.id} className="py-2 text-text hover:text-success">
              <Link
                href={subItem.href}
                className={`flex items-center ${
                  pathname.includes(subItem.id) ? "text-primary" : ""
                } ${sidebarOpen ? "" : "justify-center"}`}
              >
                <h1 className={`${sidebarOpen ? "" : "hidden"}`}>
                  {subItem.title}
                </h1>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <hr
        className={`w-5/6 mx-auto ${
          pathname.includes(section.href) ? "border-primary" : "border-text"
        }`}
      />
    </li>
  ));

  return (
    <>
      <nav
        className={`fixed md:static h-screen flex flex-col items-center justify-center z-40 text-text 
           ${
             sidebarOpen ? "w-64" : "w-20"
           } transition-all duration-150 ease-linear`}
      >
        <div
          className={`${
            sidebarOpen ? "flex-row" : "flex-col"
          } w-full mt-4 flex px-2 justify-between items-center`}
        >
          <div className="Logo flex-1">
            {sidebarOpen ? (
              <Link href="/dashboard">
                <div className="flex gap-2 justify-center items-center mx-auto">
                  <AdjustRounded className="text-primary text-3xl" />
                  <h1 className="text-3xl font-black text-primary">FOCUS</h1>
                </div>
                <div
                  className=" flex gap-2 justify-end
                 pl-6 mt-4"
                >
                  <p className="text-xl text-primary font-bold">
                    {ClientName || "NA"}
                  </p>
                </div>
              </Link>
            ) : (
              <Link href="/dashboard">
                <div className="flex gap-2 justify-center items-center mx-auto">
                  <AdjustRounded className="text-primary text-3xl" />
                </div>
              </Link>
            )}
          </div>
          <div
            className={`hamburger ${
              sidebarOpen ? "justify-end" : "justify-center"
            }`}
          >
            <button
              onClick={toggleSidebar}
              className="cursor-pointer hover:text-secondary "
            >
              {sidebarOpen ? (
                <MenuOpenRounded fontSize="large" />
              ) : (
                <MenuRounded fontSize="large" />
              )}
            </button>
          </div>
        </div>
        <div className="contentDiv w-full flex-1 flex flex-col justify-between mt-20 mb-12 ">
          <div className="w-full">
            <ul>{sectionItems}</ul>
          </div>
        </div>
      </nav>
    </>
  );
}
