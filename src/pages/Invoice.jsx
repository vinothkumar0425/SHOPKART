import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const ref = doc(db, "orders", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setOrder({ id: snap.id, ...snap.data() });
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error("Failed to load invoice", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading invoice...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Invoice not found</p>
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Go to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl p-6 shadow">

        <h1 className="text-2xl font-bold mb-4">
          Invoice #{order.id}
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Order Date:{" "}
          {order.createdAt?.seconds
            ? new Date(order.createdAt.seconds * 1000).toDateString()
            : "—"}
        </p>

        {/* ITEMS */}
        <div className="border-t border-b py-4 space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm"
            >
              <span>
                {item.name} × {item.qty || 1}
              </span>
              <span>₹ {item.price}</span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span>₹ {order.total}</span>
        </div>

        {/* ADDRESS */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {order.address.fullName}<br />
            {order.address.street}<br />
            {order.address.city}, {order.address.state} – {order.address.pincode}<br />
            Phone: {order.address.phone}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Back to Orders
          </button>

          <button
            onClick={() => window.print()}
            className="px-6 py-2 border rounded-lg"
          >
            Print Invoice
          </button>
        </div>

      </div>
    </div>
  );
}
