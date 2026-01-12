import { useEffect, useState, useContext } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,        // ✅ Firestore document ID
          ...doc.data(),
        }));

        setOrders(list);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          My Orders
        </h1>

        {orders.length === 0 && (
          <p className="text-gray-500">
            No orders found
          </p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/invoice/${order.id}`)} // ✅ FIX
              className="cursor-pointer bg-white dark:bg-[#0f172a] border dark:border-gray-700 rounded-xl p-5 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.createdAt?.seconds
                      ? new Date(
                          order.createdAt.seconds * 1000
                        ).toDateString()
                      : "—"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                  ${
                    order.status === "Placed"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between mt-4 text-sm">
                <span>
                  {order.items?.length || 0} item(s)
                </span>
                <span className="font-semibold">
                  ₹ {order.total}
                </span>
              </div>

              <div className="text-right mt-3">
                <span className="text-blue-600 text-sm">
                  View Invoice →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
