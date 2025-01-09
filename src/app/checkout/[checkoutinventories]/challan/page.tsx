"use client";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { FC, useState, useEffect } from "react";
import { useCheckoutDetails } from "@/app/hooks/checkouts/useCheckoutDetails";
import { getCookie } from "cookies-next";
import {
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material";
import { ChallanPreviewPageProps } from "@/types/CheckoutInterface";
import Loading from "@/app/loading";
import { useRouter, useSearchParams } from "next/navigation";
import GenerateSaleChallanPDF from "@/components/GenerateSaleChallanPDF";
import GenerateFocChallanPDF from "@/components/GenerateFocChallanPDF";
import GenerateSaleGatePassPDF from "@/components/GenerateSaleGatePass";
import GenerateFocGatePassPDF from "@/components/GenerateFocGatePass";
import React from "react";
const ChallanPreviewPage: FC<ChallanPreviewPageProps> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authKey = getCookie("authKey") as string;
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1; // Convert page number to integer, default to 0 if not present
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [activeTab, setActiveTab] = useState<"sales" | "foc" | "gatePass">(
    "gatePass"
  );
  const [isForSaleChallan, setIsForSaleChallan] = useState<boolean>(true);
  const [isForGatePass, setIsForGatePass] = useState<boolean>(true);

  const {
    data: checkoutDetails,
    error: checkoutDetailsError,
    isLoading: checkoutDetailsLoading,
  } = useCheckoutDetails(
    authKey,
    params.checkoutinventories,
    isForSaleChallan,
    isForGatePass
  );

  useEffect(() => {
    router.replace(`?page=${currentPage}`, { scroll: false });
  }, [currentPage, router]);
  if (checkoutDetailsLoading || !checkoutDetails) return <Loading />;
  if (checkoutDetailsError) return <p>Error loading checkout list.</p>;
  if (!checkoutDetails || !checkoutDetails.CompanyDetails) {
    return <Loading />;
  }
  const totalPages = checkoutDetails.CompanyDetails.length || 1;
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  return (
    <div className="text-center py-4">
      <div className="flex justify-start">
        {checkoutDetails.HasSale && (
          <button
            onClick={() => {
              setCurrentPage(1);
              setIsForSaleChallan(true);
              setIsForGatePass(false);
              setActiveTab("sales");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "sales" ? "" : "opacity-60"
            }`}
          >
            Sales Challan
          </button>
        )}
        {checkoutDetails.HasFoc && (
          <button
            onClick={() => {
              setCurrentPage(1);
              setIsForSaleChallan(false);
              setIsForGatePass(false);
              setActiveTab("foc");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "foc" ? "" : "opacity-60"
            }`}
          >
            Free of Cost (FOC) Challan
          </button>
        )}
        <button
          onClick={() => {
            setCurrentPage(1);
            setIsForGatePass(true);
            setActiveTab("gatePass");
          }}
          className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
            activeTab === "gatePass" ? "" : "opacity-60"
          }`}
        >
          Gate Pass
        </button>
      </div>
      {activeTab === "sales" ? (
        <div className="bg-surface px-4 rounded-tl-xl rounded-br-xl">
          <div className="flex justify-between py-2">
            <h1 className="text-lg font-bold">
              Sales Challan for Checkout #{checkoutDetails?.CheckoutNumber}
            </h1>
            <div className="flex gap-4">
              <PDFDownloadLink
                document={
                  <GenerateSaleChallanPDF
                    companyDetails={
                      checkoutDetails.CompanyDetails[currentPage - 1]
                    }
                    checkoutList={checkoutDetails.SelectedInventories}
                    poNumber={checkoutDetails.PurchaseOrderNumber}
                    remarks={checkoutDetails.Remarks}
                  />
                }
                fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                  .SaleChallanNumber!}.pdf`}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
              >
                {({ loading }) =>
                  loading ? "Loading..." : "Download Sales Challan PDF"
                }
              </PDFDownloadLink>
            </div>
          </div>
          {totalPages > 0 ? (
            <div>
              <PDFViewer width="600" height="900" className="mx-auto">
                <GenerateSaleChallanPDF
                  companyDetails={
                    checkoutDetails.CompanyDetails[currentPage - 1]
                  }
                  checkoutList={checkoutDetails.SelectedInventories}
                  poNumber={checkoutDetails.PurchaseOrderNumber}
                  remarks={checkoutDetails.Remarks}
                />
              </PDFViewer>
              <div className="mt-4 flex justify-center gap-2 items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
                >
                  <KeyboardArrowLeftRounded />
                </button>
                <h1>{currentPage}</h1>{" "}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
                >
                  <KeyboardArrowRightRounded />
                </button>
              </div>
            </div>
          ) : (
            <p>No pages available to preview.</p>
          )}
        </div>
      ) : activeTab === "foc" ? (
        <div className="bg-surface px-4 rounded-tl-xl rounded-br-xl">
          <div className="flex justify-between py-2">
            <h1 className="text-lg font-bold">
              FOC Challan for Checkout #{checkoutDetails?.CheckoutNumber}
            </h1>
            <div className="flex gap-4">
              {currentPage === totalPages && (
                <PDFDownloadLink
                  document={
                    <GenerateFocGatePassPDF
                      companyDetails={
                        checkoutDetails.CompanyDetails[currentPage - 1]
                      }
                      checkoutList={checkoutDetails.SelectedInventories}
                    />
                  }
                  fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                    .SaleChallanNumber!}-GatePass.pdf`}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
                >
                  {({ loading }) =>
                    loading ? "Loading..." : "Download Gate Pass PDF"
                  }
                </PDFDownloadLink>
              )}
              <PDFDownloadLink
                document={
                  <GenerateFocChallanPDF
                    companyDetails={
                      checkoutDetails.CompanyDetails[currentPage - 1]
                    }
                    checkoutList={checkoutDetails.SelectedInventories}
                    poNumber={checkoutDetails.PurchaseOrderNumber}
                    remarks={checkoutDetails.Remarks}
                  />
                }
                fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                  .FocChallanNumber!}.pdf`}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
              >
                {({ loading }) =>
                  loading ? "Loading..." : "Download FOC Challan PDF"
                }
              </PDFDownloadLink>
            </div>
          </div>

          <PDFViewer width="600" height="900" className="mx-auto">
            <GenerateFocChallanPDF
              companyDetails={checkoutDetails.CompanyDetails[currentPage - 1]}
              checkoutList={checkoutDetails.SelectedInventories}
              poNumber={checkoutDetails.PurchaseOrderNumber}
              remarks={checkoutDetails.Remarks}
            />
          </PDFViewer>
          <div className="mt-4 flex justify-center gap-2 items-center">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
            >
              <KeyboardArrowLeftRounded />
            </button>
            <h1>{currentPage}</h1>{" "}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
            >
              <KeyboardArrowRightRounded />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface px-4 rounded-tl-xl rounded-br-xl">
          <div className="flex justify-between py-2">
            <h1 className="text-lg font-bold">
              Gate Pass for Checkout #{checkoutDetails?.CheckoutNumber}
            </h1>
            <div className="flex gap-4">
              {currentPage === totalPages && (
                <>
                  <PDFDownloadLink
                    document={
                      <GenerateSaleGatePassPDF
                        companyDetails={
                          checkoutDetails.CompanyDetails[currentPage - 1]
                        }
                        checkoutList={checkoutDetails.SelectedInventories}
                      />
                    }
                    fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                      .SaleChallanNumber!}-GatePass.pdf`}
                    className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
                  >
                    {({ loading }) =>
                      loading ? "Loading..." : "Download Gate Pass PDF"
                    }
                  </PDFDownloadLink>
                  {/* <PDFDownloadLink
                    document={
                      <GenerateFocGatePassPDF
                        companyDetails={
                          checkoutDetails.CompanyDetails[currentPage - 1]
                        }
                        checkoutList={checkoutDetails.SelectedInventories}
                      />
                    }
                    fileName={`${checkoutDetails.CompanyDetails[currentPage - 1]
                      .SaleChallanNumber!}-FOCGatePass.pdf`}
                    className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
                  >
                    {({ loading }) =>
                      loading ? "Loading..." : "Download FOC Gate Pass PDF"
                    }
                  </PDFDownloadLink> */}
                </>
              )}
            </div>
          </div>
          {totalPages > 0 ? (
            <div>
              <div className="flex gap-4">
                <PDFViewer width="600" height="900" className="mx-auto">
                  <GenerateSaleGatePassPDF
                    companyDetails={
                      checkoutDetails.CompanyDetails[currentPage - 1]
                    }
                    checkoutList={checkoutDetails.SelectedInventories}
                  />
                </PDFViewer>
                {/* {checkoutDetails.HasFoc && 
                  <PDFViewer width="600" height="900" className="mx-auto">
                    <GenerateFocGatePassPDF
                      companyDetails={
                        checkoutDetails.CompanyDetails[currentPage - 1]
                      }
                      checkoutList={checkoutDetails.SelectedInventories}
                    />
                  </PDFViewer>
                } */}
              </div>
              <div className="mt-4 flex justify-center gap-2 items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
                >
                  <KeyboardArrowLeftRounded />
                </button>
                <h1>{currentPage}</h1>{" "}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-primary hover:opacity-80 text-white rounded-xl disabled:opacity-40"
                >
                  <KeyboardArrowRightRounded />
                </button>
              </div>
            </div>
          ) : (
            <p>No pages available to preview.</p>
          )}
        </div>
      )}
    </div>
  );
};
export default ChallanPreviewPage;
