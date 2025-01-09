"use client";

import { useCheckoutList } from "@/app/hooks/checkouts/useCheckoutList";
import { DoneRounded, WarningRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";
import { useVerifyCheckoutList } from "@/app/hooks/checkouts/useVerifyCheckout";
import { useCancelCheckoutList } from "@/app/hooks/checkouts/useCancelCheckout";
import { permanentRedirect, useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/loading";

const BarcodeReaderPage = (context: any) => {
  const [barcode, setBarcode] = useState<string>(""); // User input barcode
  const [barcodeList, setBarcodeList] = useState<Set<string>>(new Set());
  const [scannedBarcodeList, setScannedBarcodeList] = useState<Set<string>>(
    new Set()
  );
  const [isFinalBarcode, setIsFinalBarcode] = useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [allScanned, setAllScanned] = useState<boolean>(false);
  const authKey = getCookie("authKey") as string;
  const { params } = context;
  const queryClient = useQueryClient();
  const verifyMutation = useVerifyCheckoutList();
  const cancelMutation = useCancelCheckoutList();
  const router = useRouter();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  let serialNumber = 1;

  const {
    data: checkoutList,
    error: checkoutListError,
    isLoading: checkoutListIsLoading,
  } = useCheckoutList(authKey, params.checkoutinventories);

  const checkoutCancelled: boolean =
    !!checkoutList && checkoutList[0].StatusCode === "CHECKOUT-CANCEL";

  if (checkoutList) {
    queryClient.setQueryData(
      ["checkoutList", params.checkoutinventories],
      checkoutList
    );
  }

  const handleCheckoutVerify = async () => {
    setButtonClicked(true);
    try {
      await verifyMutation.mutateAsync(params.checkoutinventories);

      localStorage.removeItem(
        `checkoutVerificationList${params.checkoutinventories}`
      );
      if (
        checkoutList &&
        checkoutList[0].CheckoutTypeName === "BranchTransfer"
      ) {
        router.push(`/checkout/${params.checkoutinventories}/btChallan`);
      } else {
        router.push(`/checkout/${params.checkoutinventories}/challan?page=1`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckoutCancel = async () => {
    try {
      await cancelMutation.mutateAsync(params.checkoutinventories);
      localStorage.removeItem(
        `checkoutVerificationList${params.checkoutinventories}`
      );
      router.push(`/checkoutlist`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalBarcodeProcessing = useCallback(() => {
    if (isFinalBarcode) {
      if (!barcodeList.has(barcode)) {
        toast.error("Item is not required for checkout!");
      } else if (scannedBarcodeList.has(barcode)) {
        toast.error("Barcode already scanned!");
      } else {
        setScannedBarcodeList((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.add(barcode);
          return newSet;
        });
        toast.success("Barcode successfully scanned!");
      }
      setBarcode("");
      setIsFinalBarcode(false);
    }
  }, [isFinalBarcode, barcode, barcodeList, scannedBarcodeList]);

  useEffect(() => {
    if (checkoutList) {
      const uniqueBarcodes = new Set<string>();
      checkoutList.forEach((item) => {
        item.SelectedInventories.forEach((inventory) => {
          uniqueBarcodes.add(inventory.Barcode);
        });
      });
      setBarcodeList(uniqueBarcodes);
    }
  }, [checkoutList]);

  useEffect(() => {
    const loadedBarcodes = localStorage.getItem(
      `checkoutVerificationList${params.checkoutinventories}`
    );
    if (loadedBarcodes) {
      setScannedBarcodeList(new Set(loadedBarcodes.split(",")));
    }
  }, [params.checkoutinventories]);

  useEffect(() => {
    if (scannedBarcodeList.size > 0) {
      localStorage.setItem(
        `checkoutVerificationList${params.checkoutinventories}`,
        Array.from(scannedBarcodeList).toString()
      );
    }
  });

  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (/^[0-9a-zA-Z]$/.test(e.key)) {
        setBarcode((prev) => prev + e.key);

        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = await setTimeout(() => {
          setIsFinalBarcode(true);
        }, 50);
      } else {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [barcode]);

  useEffect(() => {
    if (isFinalBarcode) {
      handleFinalBarcodeProcessing();
    }
  }, [isFinalBarcode, handleFinalBarcodeProcessing]);

  useEffect(() => {
    if (barcodeList.size > 0 && barcodeList.size === scannedBarcodeList.size) {
      setAllScanned(true);
    } else {
      setAllScanned(false);
    }
  }, [scannedBarcodeList, barcodeList]);

  if (checkoutListIsLoading || !checkoutList) {
    return <Loading />;
  }
  if (checkoutListError) return <div>Error: {checkoutListError.message}</div>;

  return (
    !!checkoutList &&
    (checkoutList[0].StatusCode === "CHECKOUT-DISPATCHED" ? (
      checkoutList[0].CheckoutTypeName === "BranchTransfer" ? (
        permanentRedirect(
          `/checkout/${checkoutList[0].CheckoutNumber}/btChallan`
        )
      ) : (
        permanentRedirect(
          `/checkout/${checkoutList[0].CheckoutNumber}/challan?page=1`
        )
      )
    ) : (
      <>
        <div className="text-center">
          <h2 className="text-success font-black">
            Start Scanning to confirm checkouts
          </h2>
        </div>

        <div className="tableDiv">
          <table className="w-full outline outline-primary rounded-lg overflow-hidden">
            <thead className="bg-primary text-white text-sm">
              <tr>
                <th>S.N.</th>
                <th>Product</th>
                <th>Batch Number</th>
                <th>Expiry Date</th>
                <th>Location</th>
                <th>Pack Size</th>
                <th>Quantity</th>
                <th>Barcode</th>
                <th>Status</th>
              </tr>
            </thead>
            {checkoutList?.map((items) => (
              <tbody key={items.Description} className="text-center text-xs">
                {items.SelectedInventories.map((inventory) => (
                  <tr key={inventory.InventoryId}>
                    <td>{serialNumber++}.</td>
                    <td className="text-left">
                      {items.Description} ({items.ShortName})
                    </td>
                    <td>{inventory.BatchNumber}</td>
                    <td>{inventory.ExpiryDate}</td>
                    <td>{inventory.Location}</td>
                    <td>{inventory.PackSize}</td>
                    <td>{inventory.Quantity}</td>
                    <td>
                      {!!inventory.Barcode ? (
                        `${inventory.Barcode}`
                      ) : (
                        <div
                          title="Please add barcode to checkout this inventory!"
                          className="w-full flex justify-center"
                        >
                          <Link
                            href={`/inventory/details/${inventory.InventoryId}`}
                          >
                            <WarningRounded className="text-error" />
                          </Link>
                        </div>
                      )}
                    </td>
                    <td>
                      {scannedBarcodeList.has(inventory.Barcode) && (
                        <DoneRounded className="text-success" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>

        <div className="flex justify-center gap-8 text-center mt-4">
          <button
            onClick={handleCheckoutCancel}
            className="bg-error hover:opacity-80 rounded-xl py-2 px-4 text-white disabled:bg-slate-500"
            disabled={checkoutCancelled}
          >
            Cancel Checkout
          </button>
          <button
            onClick={handleCheckoutVerify}
            className="bg-success hover:opacity-80 rounded-xl py-2 px-4 text-white disabled:bg-slate-500"
            disabled={!allScanned || checkoutCancelled || buttonClicked}
          >
            Generate Challan
          </button>
        </div>
      </>
    ))
  );
};

export default BarcodeReaderPage;
