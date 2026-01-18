import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import Rating from "./Rating";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const { toggleWishlist, wishlist } = useContext(WishlistContext);

  const inCart = cartItems.some((i) => i.id === product.id);
  const inWishlist = wishlist.some((i) => i.id === product.id);

  /* ================= LOGIN GUARD ================= */
  const requireLogin = () => {
    toast.error("Please login to continue");
    navigate("/login");
  };

  /* ================= HANDLERS ================= */
  const handleAddToCart = () => {
    if (!user) {
      requireLogin();
      return;
    }

    if (inCart) {
      toast("Already in cart");
      return;
    }

    addToCart(product);
    toast.success("Added to cart");
  };

  const handleWishlist = () => {
    if (!user) {
      requireLogin();
      return;
    }

    if (inWishlist) {
      toast("Already in wishlist");
      return;
    }

    toggleWishlist(product);
    toast.success("Added to wishlist");
  };

  return (
    <div
      className="
        group relative overflow-hidden
        bg-white dark:bg-slate-900
        rounded-2xl p-5 shadow
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className="
          absolute top-4 right-4 z-10
          text-xl
          text-gray-400 hover:text-red-500
          opacity-0 group-hover:opacity-100
        "
      >
        ♥
      </button>

      {/* Image */}
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-44 mx-auto object-contain group-hover:scale-105 transition"
        />
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="font-semibold line-clamp-1">
          {product.name}
        </h3>

        <Rating value={product.rating || 4} readOnly />

        <p className="font-bold mt-2">
          ₹ {product.price}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={inCart}
          className="
            mt-4 w-full py-2 rounded-lg
            bg-black text-white
            disabled:bg-gray-300
          "
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
