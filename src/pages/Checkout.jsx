import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  const upiValid = upiId.includes("@");

  const cardValid =
    card.number.replace(/\s/g, "").length === 16 &&
    card.name &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    card.cvv.length === 3;

  const paymentValid =
    paymentMethod === "COD" ||
    (paymentMethod === "UPI" && upiValid) ||
    (paymentMethod === "CARD" && cardValid);

  /* ================= FORMATTERS ================= */
  const formatCardNumber = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v) => {
    const c = v.replace(/\D/g, "").slice(0, 4);
    if (c.length <= 2) return c;
    return `${c.slice(0, 2)}/${c.slice(2)}`;
  };

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const order = await placeOrder(
        cartItems,
        total,
        address,
        paymentMethod
      );

      clearCart();
      toast.success("Order placed successfully");

      // 🔥 Mobile-safe navigation
      setTimeout(() => {
        navigate("/order-success", {
          state: { orderId: order.id },
          replace: true,
        });
      }, 100);
    } catch {
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* ================= STEPS ================= */}
        <div className="flex justify-center gap-4 mb-10">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold
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
          <div className="md:col-span-2 space-y-6">

            {/* STEP 1 – ADDRESS */}
            {step === 1 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
                <h2 className="font-semibold mb-6">Delivery Address</h2>

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
                  placeholder="Street"
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
                    type="button"
                    disabled={!addressValid}
                    onClick={() => setStep(2)}
                    className="px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 – PAYMENT */}
            {step === 2 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
                <h2 className="font-semibold mb-6">Payment Method</h2>

                <label className="block border rounded-xl p-4 mb-4">
                  <input
                    type="radio"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />{" "}
                  Cash on Delivery
                </label>

                <label className="block border rounded-xl p-4 mb-4">
                  <input
                    type="radio"
                    checked={paymentMethod === "UPI"}
                    onChange={() => setPaymentMethod("UPI")}
                  />{" "}
                  UPI
                  {paymentMethod === "UPI" && (
                    <input
                      className="checkout-input mt-4"
                      placeholder="example@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  )}
                </label>

                <label className="block border rounded-xl p-4">
                  <input
                    type="radio"
                    checked={paymentMethod === "CARD"}
                    onChange={() => setPaymentMethod("CARD")}
                  />{" "}
                  Card
                  {paymentMethod === "CARD" && (
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <input
                        className="checkout-input"
                        placeholder="Card Number"
                        value={card.number}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            number: formatCardNumber(e.target.value),
                          })
                        }
                      />
                      <input
                        className="checkout-input"
                        placeholder="Name on Card"
                        value={card.name}
                        onChange={(e) =>
                          setCard({ ...card, name: e.target.value })
                        }
                      />
                      <input
                        className="checkout-input"
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            expiry: formatExpiry(e.target.value),
                          })
                        }
                      />
                      <input
                        className="checkout-input"
                        placeholder="CVV"
                        maxLength={3}
                        value={card.cvv}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            cvv: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </div>
                  )}
                </label>

                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!paymentValid}
                    onClick={() => setStep(3)}
                    className="px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 – REVIEW */}
            {step === 3 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
                <h2 className="font-semibold mb-4">Review Order</h2>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b"
                  >
                    <span>
                      {item.name} × {item.qty || 1}
                    </span>
                    <span>₹ {item.price}</span>
                  </div>
                ))}

                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setStep(2)}>
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded active:scale-95 touch-manipulation"
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-fit shadow">
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
