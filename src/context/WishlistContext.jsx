import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const key = user ? `wishlist_${user.email}` : null;

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (key) {
      setWishlist(JSON.parse(localStorage.getItem(key)) || []);
    }
  }, [key]);

  useEffect(() => {
    if (key) {
      localStorage.setItem(key, JSON.stringify(wishlist));
    }
  }, [wishlist, key]);

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
