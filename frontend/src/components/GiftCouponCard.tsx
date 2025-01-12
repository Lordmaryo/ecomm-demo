import React, { useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
  const [userCouponInput, setUserCouponInput] = useState("");
  const { coupon, isCouponApplied } = useCartStore();

  const handleCoupon = () => {
    console.log(userCouponInput);
  };

  const handleRemoveCoupon = () => {
    setUserCouponInput("");
  };

  return (
    <div className="shadow-md p-4 mt-10 lg:mt-0">
      <p className="font-medium">Do you have a gift coupon?</p>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="p-1 outline-none mt-2 rounded-md border border-zinc-500"
          value={userCouponInput}
          required
          onChange={(e) => setUserCouponInput(e.target.value.toUpperCase())}
        />
        <button
          onClick={handleCoupon}
          className="bg-black hover:bg-[#000000df] transition-colors text-white py-2 px-4 rounded-md"
        >
          Apply code
        </button>
        {userCouponInput.length > 0 && (
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </button>
        )}
      </div>
      {true && true && (
        <div>
          <div className="text-sm mt-2">
            <p>
              <span className="font-bold">Applied coupon: </span>
              <span className="text-zinc-500">
                {coupon?.code || "No coupon code"}
              </span>
              <span className="text-zinc-500">
                {" "}
                - {coupon?.discountPercentage || 0}% off
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCouponCard;
