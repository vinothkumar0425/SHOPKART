import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId;

  // 🔐 Safety check
  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow text-center max-w-md">

        <div className="text-green-600 text-5xl mb-4">✔</div>

        <h1 className="text-2xl font-bold mb-2">
          Order Placed Successfully
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Thank you for shopping with SHOPKART
        </p>

        <p className="text-sm mb-6">
          Order ID:
          <span className="font-semibold"> {orderId}</span>
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(`/invoice/${orderId}`)}
            className="px-6 py-2 bg-black text-white rounded"
          >
            View Invoice
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 border rounded"
          >
            My Orders
          </button>
        </div>

      </div>
    </div>
  );
}
