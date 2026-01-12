import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Rating from "./Rating";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(CartContext);
  const { toggleWishlist, wishlist } = useContext(WishlistContext);

  const inCart = cartItems.some((i) => i.id === product.id);
  const inWishlist = wishlist.some((i) => i.id === product.id);

  return (
    <div
      className="
        group
        bg-white dark:bg-slate-900
        rounded-2xl p-5
        shadow
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      {/* Wishlist */}
      <button
        onClick={() => {
          toggleWishlist(product);
          toast.success(
            inWishlist ? "Removed from wishlist" : "Added to wishlist"
          );
        }}
        className="
          absolute top-4 right-4 text-xl
          transition-transform duration-200
          hover:scale-125
          text-gray-400
          hover:text-red-500
        "
      >
        ♥
      </button>

      {/* Image */}
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="cursor-pointer overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="
            h-44 mx-auto object-contain
            transition-transform duration-300
            group-hover:scale-105
          "
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
          onClick={() => {
            if (inCart) {
              toast("Already in cart");
              return;
            }
            addToCart(product);
            toast.success("Added to cart");
          }}
          disabled={inCart}
          className="
            mt-4 w-full py-2 rounded-lg font-medium
            transition-all duration-200
            active:scale-95
            hover:opacity-90
            bg-black text-white
            disabled:bg-gray-300 disabled:text-gray-600
          "
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
