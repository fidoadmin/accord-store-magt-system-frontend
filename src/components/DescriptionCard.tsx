"use client";

import { DescriptionCardPropsInterface } from "@/types/ComponentInterface";
import Link from "next/link";
import React from "react";

const DescriptionCard: React.FC<DescriptionCardPropsInterface> = ({
  description,
  title,
  hasPartNumber,
  hasModelName,
}) => {
  return (
    <>
      <Link href={`/inventory/details/${description.Id}`}>
        <div
          className={``}
          title={`${description.Description}`}
        >
          <div className="cardText flex justify-between items-center gap-2 group p-2 border-2 hover:bg-primary rounded-xl">
            <p className="w-full text-left truncate ">
              {description.ManufacturerName}
            </p>
            <p className="description truncate w-full">
              {description.Description}
            </p>
            <p className="w-full text-center truncate">{description.ShortName}</p>

            {title?.toLowerCase() !== "inventory" && (
              <p className="w-full text-center">{description.CategoryName}</p>
            )}
            {hasModelName && (
              <p className="w-full text-center">{description.ModelName}</p>
            )}
            {hasPartNumber && (
              <p className="w-full text-center">{description.PartNumber}</p>
            )}
            {description.Stock > 0 ? (
              <p className={`w-full text-center`}>{description.Stock}</p>
            ) : (
              <p className={`w-full text-center text-error font-black`}>
                Out of Stock
              </p>
            )}
            <p className="w-full text-center">{description.Location}</p>
          </div>
        </div>
      </Link>
    </>
  );
};
export default DescriptionCard;
