"use client";

import { useCheckoutToAndForDetails } from "@/app/hooks/checkouts/useCheckoutToAndForDetails";
import { checkoutListInnerCardPropsInterface } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";
import Loading from "@/app/loading";
import TableHeader from "./TableHeader";

import Link from "next/link";

const CheckoutListInnerCard: React.FC<checkoutListInnerCardPropsInterface> = ({
  checkoutNumber,
}) => {
  const authKey = getCookie("authKey") as string;

  const {
    data: checkoutToAndForDetails,
    isLoading: checkoutToAndForLoading,
    isError: checkoutToAndForError,
  } = useCheckoutToAndForDetails(authKey, checkoutNumber);

  if (checkoutToAndForLoading || !checkoutToAndForDetails) {
    return <Loading />;
  }

  if (checkoutToAndForError) {
    return <div>Error Loading Data</div>;
  }

  const handleDetailsClick = (
    checkoutNumber: string,
    statusCode: string,
    checkoutType: string,
    index?: number
  ) => {
    let Url = "";
    if (statusCode === "CHECKOUT-DISPATCHED") {
      checkoutType === "CHECKOUT-BRANCHTRANSFER"
        ? (Url = `/checkout/${checkoutNumber}/btChallan`)
        : (Url = `/checkout/${checkoutNumber}/challan?page=${index}`);
    } else {
      Url = `/checkout/${checkoutNumber}`;
    }
    return Url;
  };
  return (
    <>
      <TableHeader tableTitle="innercheckoutlist" />
      {checkoutToAndForDetails?.CheckoutType === "CHECKOUT-EXTERNALTRANSFER"
        ? checkoutToAndForDetails?.CompanyDetails.map((company, index) => (
            <Link
              href={handleDetailsClick(
                checkoutToAndForDetails.CheckoutNumber,
                checkoutToAndForDetails.StatusCode,
                checkoutToAndForDetails.CheckoutType,
                index + 1
              )}
              key={company.CompanyFromId}
            >
              <div
                className={`checkoutInnerCard w-full mx-auto text-sm  hover:bg-secondary hover:text-white text-text cursor-pointer rounded-xl`}
              >
                {
                  <div className="cardText flex justify-between items-center gap-2 group p-2">
                    <p className="w-full text-center">
                      {company.SaleChallanNumber
                        ? company.SaleChallanNumber
                        : company.FocChallanNumber}
                    </p>
                    <p className="w-full text-center">{company.CompanyFrom}</p>
                    <p className="w-full text-center">{company.CompanyTo}</p>
                  </div>
                }
              </div>
            </Link>
          ))
        : checkoutToAndForDetails?.BranchDetails.map((branch, index) => (
            <Link
              href={handleDetailsClick(
                checkoutToAndForDetails.CheckoutNumber,
                checkoutToAndForDetails.StatusCode,
                checkoutToAndForDetails.CheckoutType
              )}
              key={branch.BranchFromId}
            >
              <div
                className={`checkoutInnerCard w-5/6 mx-auto text-sm bg-surface hover:bg-secondary hover:text-white text-text cursor-pointer rounded-xl`}
              >
                {
                  <div className="cardText flex justify-between items-center gap-2 group p-2">
                    <p className="w-full text-center">
                      {branch.SaleChallanNumber}
                    </p>
                    <p className="w-full text-center">{branch.BranchFrom}</p>
                    <p className="w-full text-center">{branch.BranchTo}</p>
                  </div>
                }
              </div>
            </Link>
          ))}
    </>
  );
};

export default CheckoutListInnerCard;
