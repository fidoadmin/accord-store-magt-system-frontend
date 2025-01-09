"use client";

import { CheckoutCardPropsInterface } from "@/types/ComponentInterface";

const CheckoutCard: React.FC<CheckoutCardPropsInterface> = ({
  description,
  onAddToCheckout,
}) => {
  return (
    <div className="rounded-xl">
      <div className="cardText flex justify-between items-center gap-2 group p-2 hover:bg-primary">
        <p className="p-2 text-center">
          <input
            type="checkbox"
            onClick={() => onAddToCheckout?.(description)}
          />
        </p>

        <p className="w-full text-center">{description.ShortName}</p>
        <p className="description font-bold truncate w-full">
          {description.CompanyName}
        </p>
        <p className="w-full text-center">{description.BranchName}</p>
        <p className="w-full text-center">{description.Stock}</p>
        <p className="w-full text-center">{description.AvailableQty}</p>
      </div>
    </div>
  );
};

export default CheckoutCard;
