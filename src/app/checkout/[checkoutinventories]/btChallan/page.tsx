"use client";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { FC, useState } from "react";
import { useCheckoutDetails } from "@/app/hooks/checkouts/useCheckoutDetails";
import { getCookie } from "cookies-next";
import GenerateBranchChallanPDF from "@/components/GenerateBranchChallanPDF";
import GenerateBranchGatePassPDF from "@/components/GenerateBranchGatePassPDF";
import { ChallanPreviewPageProps } from "@/types/CheckoutInterface";
import Loading from "@/app/loading";

const BTChallanPreviewPage: FC<ChallanPreviewPageProps> = ({ params }) => {
  const [isForSaleChallan, setIsForSaleChallan] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"sales" | "gatePass">("sales");

  const authKey = getCookie("authKey") as string;

  const {
    data: checkoutDetails,
    error: checkoutDetailsError,
    isLoading: checkoutDetailsLoading,
  } = useCheckoutDetails(
    authKey,
    params.checkoutinventories,
    isForSaleChallan!
  );

  if (checkoutDetailsLoading || !checkoutDetails) return <Loading />;
  if (checkoutDetailsError) return <p>Error loading checkout list.</p>;

  if (!checkoutDetails || !checkoutDetails.BranchDetails) {
    return <Loading />;
  }

  return (
    <div className="text-center py-4">
      <div className="flex justify-between py-2">
        <div className="flex justify-start">
          <button
            onClick={() => {
              setIsForSaleChallan(true);
              setActiveTab("sales");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "sales" ? "" : "opacity-60"
            }`}
          >
            Branch Transfer Challan
          </button>
          <button
            onClick={() => {
              setIsForSaleChallan(true);
              setActiveTab("gatePass");
            }}
            className={`px-4 py-2 text-white rounded-t-lg bg-primary ${
              activeTab === "gatePass" ? "" : "opacity-60"
            }`}
          >
            Gate Pass
          </button>
        </div>

        {activeTab === "sales" && (
          <PDFDownloadLink
            document={
              <GenerateBranchChallanPDF
                companyDetails={checkoutDetails.CompanyDetails[0]}
                branchDetails={checkoutDetails.BranchDetails[0]}
                checkoutList={checkoutDetails.SelectedInventories}
                poNumber={checkoutDetails.PurchaseOrderNumber}
                remarks={checkoutDetails.Remarks}
              />
            }
            fileName={`${checkoutDetails.BranchDetails[0].ChallanNumber}.pdf`}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-80"
          >
            {({ loading }) =>
              loading ? "Loading..." : "Download Current Page PDF"
            }
          </PDFDownloadLink>
        )}
      </div>

      {activeTab === "sales" ? (
        <div>
          <PDFViewer width="600" height="900" className="mx-auto">
            <GenerateBranchChallanPDF
              companyDetails={checkoutDetails.CompanyDetails[0]}
              branchDetails={checkoutDetails.BranchDetails[0]}
              checkoutList={checkoutDetails.SelectedInventories}
              poNumber={checkoutDetails.PurchaseOrderNumber}
              remarks={checkoutDetails.Remarks}
            />
          </PDFViewer>
        </div>
      ) : (
        <div>
          <PDFViewer width="600" height="900" className="mx-auto">
            <GenerateBranchGatePassPDF
              companyDetails={checkoutDetails.CompanyDetails[0]}
              branchDetails={checkoutDetails.BranchDetails[0]}
              checkoutList={checkoutDetails.SelectedInventories}
              poNumber={checkoutDetails.PurchaseOrderNumber}
              remarks={checkoutDetails.Remarks}
            />
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

export default BTChallanPreviewPage;
