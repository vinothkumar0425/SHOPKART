import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Package, Truck, Home } from "lucide-react";

export default function OrderSuccess() {
  const { state } = useLocation();
  const orderId = state?.orderId || "ORD-XXXX";

  /* ================= DATE LOGIC ================= */
  const orderDate = new Date();
  const deliveryDays = 5; // demo: delivery in 5 days
  const deliveryDate = new Date();
  deliveryDate.setDate(orderDate.getDate() + deliveryDays);

  const daysLeft = Math.ceil(
    (deliveryDate - new Date()) / (1000 * 60 * 60 * 24)
  );

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  /* ================= TRACKING STEPS ================= */
  const steps = [
    {
      title: "Order Placed",
      desc: `Placed on ${formatDate(orderDate)}`,
      done: true,
      icon: <CheckCircle size={18} />,
    },
    {
      title: "Order Confirmed",
      desc: "Seller has confirmed your order",
      done: true,
      icon: <Package size={18} />,
    },
    {
      title: "Shipped",
      desc: "Package handed over to courier",
      done: true,
      icon: <Truck size={18} />,
    },
    {
      title: "Out for Delivery",
      desc: `Expected by ${formatDate(deliveryDate)}`,
      done: false,
      icon: <Truck size={18} />,
    },
    {
      title: "Delivered",
      desc: "Product will be delivered",
      done: false,
      icon: <Home size={18} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-8 shadow">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-600">
            Order Confirmed 🎉
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
        </div>

        {/* DELIVERY INFO */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-5 mb-10">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            🚚 Expected Delivery
          </p>
          <p className="text-lg font-semibold text-green-700 dark:text-green-400">
            {formatDate(deliveryDate)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Delivery in <span className="font-medium">{daysLeft} days</span>
          </p>
        </div>

        {/* TRACKING TIMELINE */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full
                  ${
                    step.done
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-400"
                  }`}
              >
                {step.icon}
              </div>

              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    step.done
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-sm text-gray-500">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center gap-4 mt-10">
          <Link
            to="/orders"
            className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-90"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
