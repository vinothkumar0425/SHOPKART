import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  /* ================= LOAD CART (ON APP START) ================= */
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  /* ================= SAVE CART ================= */
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  /* ================= ADD TO CART ================= */
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  /* ================= REMOVE ONE ITEM ================= */
  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  /* ================= DELETE ITEM COMPLETELY ================= */
  const deleteFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  /* ================= CLEAR CART ================= */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  /* ================= TOTAL COUNT ================= */
  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  /* ================= TOTAL PRICE ================= */
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
