import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);

  /* ================= LOAD CART (USER BASED) ================= */
  useEffect(() => {
    if (user) {
      const savedCart =
        JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
      setCartItems(savedCart);
    } else {
      setCartItems([]); // logout → empty cart
    }
  }, [user]);

  /* ================= SAVE CART ================= */
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `cart_${user.uid}`,
        JSON.stringify(cartItems)
      );
    }
  }, [cartItems, user]);

  /* ================= ACTIONS ================= */
  const addToCart = (product) => {
    setCartItems((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev;
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id, qty) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, qty) } : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      localStorage.removeItem(`cart_${user.uid}`);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
