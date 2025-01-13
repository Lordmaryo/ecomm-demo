import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { paymentSessionResponse } from "../types/types";

const stripePromise = loadStripe(
  "pk_test_51QdfJaBaJ5zIDcgOlE8R5mxA6DoSqI3HU2wDXnmLLVs1BQM8rxJmKttGEH8xzQkr8oXmo0AqDRgAdihL4TAFlgRE00Wb62aliu"
);

const OrderSummary = () => {
  const { total, subTotal, isCouponApplied, coupon, cart } = useCartStore();
  const savings = subTotal - total;
  const formattedTotal = total.toFixed(2);
  const formattedSubtotal = subTotal.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const res = await axios.post<paymentSessionResponse>(
        "/payment/create-checkout-session",
        {
          products: cart,
          couponCode: coupon ? coupon.code : null,
        }
      );
      const session = res.data;
      const result = await stripe?.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result?.error) {
        console.error("Error in payment", result.error.message);
      }
    } catch (error) {
      toast.error("Error processing payment");
    }
  };

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
          onClick={handlePayment}
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
