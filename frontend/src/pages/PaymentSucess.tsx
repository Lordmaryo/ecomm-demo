import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../lib/axios";
import Confetti from "react-confetti";
import { useCartStore } from "../stores/useCartStore";
import { useEffect, useState } from "react";

const PaymentSucess = () => {
  const { clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handlePaymentSuccess = async (sessionId: string | null) => {
      try {
        const res = await axios.post("payment/checkout-success", { sessionId });
        console.log(res.data);
        clearCart();
      } catch (error) {
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );

    if (sessionId) {
      handlePaymentSuccess(sessionId);
    } else {
      setIsProcessing(false);
      setError("No session ID found in url");
    }
  }, [clearCart]);

  if (isProcessing) return <div>Processing...</div>;
  if (error) return <div>Error {error}</div>;

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.3}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />
      <div className="max-w-md w-full rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center text-green-500">
            <CheckCircle className=" w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center  mb-2">
            Purchase Successful!
          </h1>

          <p className="text-zinc-500 text-center mb-2">
            Thank you for your order. {"We're"} processing it now.
          </p>
          <p className=" text-center text-sm mb-6">
            Check your email for order details and updates.
          </p>
          <div className="rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Order number</span>
              <span className="text-sm font-semibold ">#12345</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Estimated delivery</span>
              <span className="text-sm font-semibold ">3-5 business days</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className="w-full bg-black hover:bg-[#000000cf] text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center"
            >
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </button>
            <Link
              to={"/"}
              className="w-full border hover:underline font-bold py-2 px-4 
            rounded-lg transition duration-300 flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSucess;