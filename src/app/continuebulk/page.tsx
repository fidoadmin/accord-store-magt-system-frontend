"use client";

import React, { useState } from "react";

function BulkCheckinOverlay() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleContinue = () => {
    console.log("Continuing with Bulk Check-in...");
    setIsOverlayVisible(false);
  };

  const handleCancel = () => {
    console.log("Bulk Check-in canceled.");
    setIsOverlayVisible(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOverlayVisible(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        More Bulk Check-in
      </button>

      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">
              Do you wish to continue for more?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleContinue}
                className="bg-success text-white px-4 py-2 rounded-lg shadow hover:bg-success transition"
              >
                Continue
              </button>
              <button
                onClick={handleCancel}
                className="bg-error
                 text-white px-4 py-2 rounded-lg shadow hover:bg-error transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BulkCheckinOverlay;
