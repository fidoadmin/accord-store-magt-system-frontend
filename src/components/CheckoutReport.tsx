import React, { useState, useEffect } from "react";
import TableHeader from "@/components/TableHeader";
import { useCheckouts } from "@/app/hooks/checkouts/useCheckouts";
import CheckoutListCard from "@/components/CheckoutListCard";
import Loading from "@/app/loading";
import Pagination from "./Pagination";

interface CheckoutReportProps {
  fromDate: string;
  toDate: string;
  statusFilter: string;
  typeFilter: string;
  isreturn?: boolean;
}

const CheckoutReport: React.FC<CheckoutReportProps> = ({
  fromDate,
  toDate,
  statusFilter,
  typeFilter,
  isreturn,
}) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [params, setParams] = useState({
    page: page,
    limit: limit,
    varsearch: "",
    statusfilter: statusFilter,
    typeFilter: typeFilter,
    isfromreport: true,
    isfromreturn: isreturn,
    fromDate,
    toDate,
  });

  const [sortby, setSortBy] = useState("created");
  const [sortorder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      onlycancelled: statusFilter === "cancelled",
      onlydispatched: statusFilter === "dispatched",
      onlyreturned: statusFilter === "returned",
      typefilter: typeFilter,
      page: page,
      fromdate: fromDate,
      todate: toDate,
      isfromreturn: isreturn,
    }));
  }, [statusFilter, page, fromDate, toDate, typeFilter]);

  const {
    data: checkouts,
    error: checkoutsError,
    isLoading: checkoutsLoading,
  } = useCheckouts({ ...params, sortby, sortorder });

  const handleSortChange = (column: string) => {
    const order = sortby === column && sortorder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(order);
  };

  if (checkoutsLoading || !checkouts) return <Loading />;
  if (checkoutsError) return <p>Error loading checkouts.</p>;

  return (
    <div className="w-full">
      {!isreturn && (
        <h1 className="text-2xl font-semibold mb-6">Checkout Report</h1>
      )}
      {checkouts && checkouts.data.length > 0 ? (
        <div className="space-y-2">
          <TableHeader
            tableTitle="checkoutList"
            handleSortChange={handleSortChange}
            sortby={sortby}
            sortorder={sortorder}
          />
          {checkouts.data.map((checkoutListItem, index) => (
            <CheckoutListCard
              key={index}
              checkoutListItem={checkoutListItem}
              isreturn={isreturn}
            />
          ))}
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(checkouts?.totalCount / limit)}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No checkouts available.</p>
      )}
    </div>
  );
};

export default CheckoutReport;
