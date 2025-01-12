import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";

const OrderSummary = () => {
  const { total, subTotal, isCouponApplied, coupon } = useCartStore();
  const savings = subTotal - total;
  const formattedTotal = total.toFixed(2);
  const formattedSubtotal = subTotal.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  return (
    <div className="space-y-4 rounded-lg border p-4 shadow-md sm:p-6">
      <p className="text-xl font-semibold">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal">Original price</dt>
            <dd className="text-base font-medium">${formattedSubtotal}</dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal">Savings</dt>
              <dd className="text-base font-medium">-${formattedSavings}</dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal">Coupon ({coupon.code})</dt>
              <dd className="text-base font-medium">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold">Total</dt>
            <dd className="text-base font-bold">${formattedTotal}</dd>
          </dl>
        </div>

        <button
          className="flex w-full items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-[#000000db] focus:outline-none"
          // onClick={handlePayment}
        >
          Proceed to Checkout
        </button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium underline hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
