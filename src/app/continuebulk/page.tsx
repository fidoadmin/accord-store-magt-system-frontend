"use client";

import React, { useState } from "react";

interface BulkCheckinOverlayProps {
  onContinue: () => void;
  onCancel: () => void;
}

const BulkCheckinOverlay: React.FC<BulkCheckinOverlayProps> = ({
  onContinue,
  onCancel,
}) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  return (
    <>
      {isOverlayVisible && (
        <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-lg z-20">
          <div
            className="bg-white w-fit rounded-lg p-6 shadow-lg relative"
            style={{ top: "-180px" }}
          >
            <h2 className="text-lg font-bold mb-4 text-center text-black">
              Do you wish to continue more with the same Batch Number and Expiry
              Date?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  onContinue();
                  setIsOverlayVisible(false);
                }}
                className="bg-success text-white px-4 py-2 rounded-lg shadow hover:bg-success transition"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  onCancel();
                  setIsOverlayVisible(false);
                }}
                className="bg-error text-white px-4 py-2 rounded-lg shadow hover:bg-error transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkCheckinOverlay;
