"use client";

import { getCookie } from "cookies-next";
import { useState, useEffect, useCallback } from "react";
import { useFetchReport } from "@/app/hooks/report/useFecthReport";
import Loading from "@/app/loading";
import TableHeader from "@/components/TableHeader";
import ReportCard from "@/components/ReportCard";
import { useFetchReportExport } from "@/app/hooks/report/useFecthReportExport";
import GenerateReportPDF from "@/components/GenerateReportPDF";
import { pdf } from "@react-pdf/renderer";
import Pagination from "./Pagination";

interface SalesReportProps {
  fromDate: string;
  toDate: string;
  customerId: string;
  inventoryDescriptionId: string;
  action: "csv" | "pdf" | "abc";
  onDownloadComplete: () => void;
}

export default function SalesReport({
  fromDate,
  toDate,
  customerId,
  inventoryDescriptionId,
  action,
  onDownloadComplete,
}: SalesReportProps) {
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sortby, setSortBy] = useState<string>("expirationdate");
  const [sortorder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [fetchCSV, setFetchCSV] = useState(false);
  const [fetchPDF, setFetchPDF] = useState(false);
  const [page, setPage] = useState(1);

  const params = {
    page: currentPage,
    limit: limit,
    search: searchTerm,
    sortBy: sortby,
    sortOrder: sortorder,
    inventoryDescriptionId,
    buyerId: customerId,
    fromDate,
    toDate,
  };

  const handleSortChange = (column: string) => {
    const order = sortby === column && sortorder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(order);
  };

  useEffect(() => {
    const authKey = getCookie("authKey") as string;
    setAuthKey(authKey);
  }, []);

  const {
    data: reportData,
    error: reportError,
    isLoading: reportLoading,
  } = useFetchReport(authKey || "", params);

  useEffect(() => {
    if (reportData) {
      if (action === "csv") {
        setFetchCSV(true);
        setFetchPDF(false);
      } else if (action === "pdf") {
        setFetchCSV(false);
        setFetchPDF(true);
      }
    }
  }, [action, reportData]);

  const { data: reportDataExport } = useFetchReportExport(
    authKey || "",
    fetchCSV,
    params
  );

  const handleDownloadComplete = useCallback(() => {
    onDownloadComplete();
  }, [onDownloadComplete]);

  useEffect(() => {
    if (fetchCSV && reportDataExport) {
      const blob = new Blob([reportDataExport], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFetchCSV(false);
      handleDownloadComplete();
    }
  }, [fetchCSV, reportDataExport, handleDownloadComplete]);

  useEffect(() => {
    if (fetchPDF && reportData) {
      pdf(<GenerateReportPDF data={reportData.data} />)
        .toBlob()
        .then((pdfBlob) => {
          const link = document.createElement("a");
          const url = URL.createObjectURL(pdfBlob);
          link.href = url;
          link.download = "report.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setFetchPDF(false);
          handleDownloadComplete();
        })
        .catch((err) => console.error("Error generating PDF", err));
    }
  }, [fetchPDF, reportData, handleDownloadComplete]);

  if (reportError) return <div>Error Loading Data</div>;

  return (
    <div className="inventoryList flex flex-col gap-4">
      {reportLoading ? (
        <Loading />
      ) : reportData && reportData.data.length > 0 ? (
        <div className="space-y-2">
          <TableHeader
            tableTitle="report"
            handleSortChange={handleSortChange}
            sortby={sortby}
            sortorder={sortorder}
          />
          {reportData.data.map((report: any) => (
            <ReportCard
              key={report.InventoryDetails.Id}
              InventoryDetails={report.InventoryDetails}
              customername={report.Customer}
            />
          ))}
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(reportData.totalCount / limit)}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      ) : (
        <div>No reports found.</div>
      )}
    </div>
  );
}
