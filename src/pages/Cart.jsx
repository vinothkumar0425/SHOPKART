import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="
              flex flex-col sm:flex-row items-center gap-6
              bg-white dark:bg-slate-900
              rounded-2xl p-5
              border border-gray-200 dark:border-slate-800
              transition-all duration-300 ease-out
              hover:-translate-y-[2px] hover:shadow-lg
            "
          >
            {/* Image */}
            <div
              onClick={() => navigate(`/product/${item.id}`)}
              className="cursor-pointer overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="
                  h-24 w-24 object-contain
                  transition-transform duration-300
                  hover:scale-[1.03]
                "
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {item.name}
              </h3>
              <p className="text-gray-500">
                ₹ {item.price}
              </p>
            </div>

            {/* Remove */}
            <button
              onClick={() => {
                removeFromCart(item.id);
                toast.success("Removed from cart");
              }}
              className="
                text-sm text-red-500
                hover:text-red-600
                transition-colors
              "
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-10 flex justify-between items-center">
        <p className="text-lg font-semibold">
          Subtotal: ₹ {subtotal}
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="
            px-6 py-3 rounded-lg
            bg-black text-white font-medium
            transition hover:opacity-90 active:scale-95
          "
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
