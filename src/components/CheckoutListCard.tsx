"use client";

import { checkoutListCardPropsInterface } from "@/types/ComponentInterface";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  LaunchRounded,
} from "@mui/icons-material";
import { useState } from "react";
import CheckoutListInnerCard from "./CheckoutListInnerCard";
import Link from "next/link";

const CheckoutListCard: React.FC<checkoutListCardPropsInterface> = ({
  checkoutListItem,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const checkoutStartedDate = checkoutListItem.Created.split("T")[0];
  const checkoutStartedTime = checkoutListItem.Created.split("T")[1]
    .split(".")[0]
    .slice(0, 5);

  const handleAccordionToggle = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleDetailsClick = (
    checkoutNumber: string,
    statusCode: string,
    checkoutType: string
  ) => {
    let Url = "";
    if (statusCode === "CHECKOUT-DISPATCHED") {
      checkoutType === "BranchTransfer"
        ? (Url = `/checkout/${checkoutNumber}/btChallan`)
        : (Url = `/checkout/${checkoutNumber}/challan?page=1`);
    } else {
      Url = `/checkout/${checkoutNumber}`;
    }
    return Url;
  };

  return (
    <table className="w-full table-auto border-2 rounded-xl overflow-hidden text-sm bg-white">
      <tbody>
        <tr
          className={`cursor-pointer hover:bg-secondary ${
            isAccordionOpen ? "bg-gray-100 border-primary" : ""
          }`}
          onClick={handleAccordionToggle}
        >
          <td className="w-1/6 text-center p-2 font-semibold">
            {checkoutListItem.CheckoutNumber}
          </td>
          <td
            className={`w-1/6 text-center p-2 ${
              checkoutListItem.Status === "Dispatched"
                ? "text-success"
                : checkoutListItem.Status === "Checkout Cancelled"
                ? "text-error"
                : "text-highlight"
            }`}
          >
            {checkoutListItem.Status}
          </td>
          <td className="w-1/6 text-center p-2">
            {checkoutListItem.CheckoutType}
          </td>
          <td className="w-1/6 text-center p-2">
            <div>
              <p>{checkoutStartedDate}</p>
              <p
                className={`${
                  Number(checkoutStartedTime.split(":")[0]) < 12
                    ? "text-highlight"
                    : "text-accent"
                }`}
              >
                {checkoutStartedTime}
              </p>
            </div>
          </td>
          <td className="w-1/6 text-center p-2">
            {checkoutListItem.CheckoutStartedBy}
          </td>
          <td className="w-1/6 text-center p-2">
            {checkoutListItem.CheckoutCompletedBy || "N/A"}
          </td>
          <td className="w-1/12 text-center p-2">
            <div
              className="cursor-pointer hover:text-success"
              title="View Details"
            >
              {isAccordionOpen ? (
                <KeyboardArrowUpRounded />
              ) : (
                <KeyboardArrowDownRounded />
              )}
            </div>
          </td>
        </tr>

        {isAccordionOpen && (
          <tr>
            <td colSpan={5} className="p-2 bg-background rounded-b-xl">
              <div className="additionalDetails flex flex-col gap-2 justify-center items-center">
                <div className="innerCard w-full">
                  <CheckoutListInnerCard
                    checkoutNumber={checkoutListItem.CheckoutNumber}
                  />
                </div>
                <Link
                  href={handleDetailsClick(
                    checkoutListItem.CheckoutNumber,
                    checkoutListItem.StatusCode,
                    checkoutListItem.CheckoutType
                  )}
                  className="bg-primary hover:opacity-80 text-white rounded-xl px-2 py-1 w-48 text-center cursor-pointer"
                  title={`Go To: Checkout Number ${checkoutListItem.CheckoutNumber}`}
                >
                  View Details
                  <span>
                    <LaunchRounded />
                  </span>
                </Link>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CheckoutListCard;
