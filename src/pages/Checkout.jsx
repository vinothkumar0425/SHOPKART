import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext";

export default function Checkout() {
  const navigate = useNavigate();

  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { placeOrder } = useContext(OrderContext);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ================= BLOCK EMPTY CART ================= */
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <div className="text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Your cart is empty
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ================= ADDRESS ================= */
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* ================= PAYMENT ================= */
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  /* ================= PRICE ================= */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.qty || 1),
    0
  );
  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  /* ================= VALIDATION ================= */
  const addressValid =
    address.fullName &&
    address.phone &&
    address.street &&
    address.city &&
    address.state &&
    address.pincode;

  const paymentValid =
    paymentMethod === "COD" ||
    (paymentMethod === "UPI" && upiId.trim()) ||
    (paymentMethod === "CARD" &&
      card.number &&
      card.name &&
      card.expiry &&
      card.cvv);

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    if (!user || !cartItems.length) return;

    try {
      setLoading(true);

      const order = await placeOrder(
        cartItems,
        total,
        address,
        paymentMethod
      );

      clearCart();

      navigate("/order-success", {
        state: { orderId: order.id },
        replace: true,
      });
    } catch (err) {
      console.error("Order failed", err);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-black text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ================= STEPS ================= */}
        <div className="flex justify-center gap-6 mb-10">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold
                ${
                  step === n
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
              {n}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* ================= LEFT ================= */}
          <div className="md:col-span-2">

            {/* STEP 1 : ADDRESS */}
            {step === 1 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-6">
                  Delivery Address
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="checkout-input"
                    placeholder="Full Name"
                    onChange={(e) =>
                      setAddress({ ...address, fullName: e.target.value })
                    }
                  />
                  <input
                    className="checkout-input"
                    placeholder="Phone Number"
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                  />
                </div>

                <input
                  className="checkout-input mt-4"
                  placeholder="Street / Area"
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <input
                    className="checkout-input"
                    placeholder="City"
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                  <input
                    className="checkout-input"
                    placeholder="State"
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                  />
                  <input
                    className="checkout-input"
                    placeholder="Pincode"
                    onChange={(e) =>
                      setAddress({ ...address, pincode: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    disabled={!addressValid}
                    onClick={() => setStep(2)}
                    className="px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 : PAYMENT */}
            {step === 2 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-6">
                  Payment Method
                </h2>

                {[
                  ["COD", "Cash on Delivery"],
                  ["UPI", "UPI (Demo)"],
                  ["CARD", "Credit / Debit Card"],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className="flex justify-between items-center border rounded p-4 mb-3 cursor-pointer"
                  >
                    <span>{label}</span>
                    <input
                      type="radio"
                      name="payment"
                      onChange={() => setPaymentMethod(value)}
                    />
                  </label>
                ))}

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border rounded"
                  >
                    Back
                  </button>
                  <button
                    disabled={!paymentValid}
                    onClick={() => setStep(3)}
                    className="px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 : REVIEW */}
    {/* STEP 3 : REVIEW */}
{step === 3 && (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
    <h2 className="text-lg font-semibold mb-4">
      Review Order
    </h2>

    {cartItems.map((item) => (
      <div
        key={item.id}
        className="flex justify-between py-3 border-b"
      >
        <span>
          {item.name} × {item.qty || 1}
        </span>
        <span>₹ {item.price}</span>
      </div>
    ))}

    <div className="flex justify-between mt-6">
      <button
        onClick={() => setStep(2)}
        className="px-4 py-2 border rounded"
      >
        Back
      </button>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  </div>
)}

          </div>

          {/* ================= SUMMARY ================= */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 h-fit shadow">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹ {shipping}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
