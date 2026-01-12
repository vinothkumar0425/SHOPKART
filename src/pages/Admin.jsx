import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";

export default function Admin() {
  const { orders } = useContext(OrderContext);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
          Admin – Orders
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-slate-800 text-black dark:text-white">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-gray-200 dark:border-slate-700"
                >
                  <td className="p-3">#{o.id}</td>
                  <td className="p-3">{o.items.length}</td>
                  <td className="p-3">₹ {o.total}</td>
                  <td className="p-3 capitalize">{o.payment}</td>
                  <td className="p-3">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
