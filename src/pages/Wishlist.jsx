import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Your wishlist is empty
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {wishlist.map((product) => {
          const inCart = cartItems.some((i) => i.id === product.id);

          return (
            <div
              key={product.id}
              className="
                group
                bg-white dark:bg-slate-900
                rounded-xl p-5
                border border-gray-200 dark:border-slate-800
                transition-all duration-300 ease-out
                hover:-translate-y-[2px]
                hover:shadow-lg
              "
            >
              <div className="flex gap-5 items-center">

                {/* IMAGE */}
                <div
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="
                      h-24 w-24 object-contain
                      transition-transform duration-300
                      group-hover:scale-[1.03]
                    "
                  />
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <h3
                    className="
                      font-medium text-gray-900 dark:text-white
                      transition-colors
                      group-hover:text-blue-600
                    "
                  >
                    {product.name}
                  </h3>

                  <p className="text-sm font-semibold mt-1">
                    ₹ {product.price}
                  </p>

                  <div className="flex gap-4 mt-3 text-sm">
                    {/* MOVE TO CART */}
                    <button
                      onClick={() => {
                        if (inCart) {
                          toast("Already in cart");
                          return;
                        }
                        addToCart(product);
                        toast.success("Moved to cart");
                      }}
                      className="
                        text-blue-600
                        transition
                        hover:underline
                      "
                    >
                      Move to Cart
                    </button>

                    {/* REMOVE */}
                    <button
                      onClick={() => {
                        toggleWishlist(product);
                        toast.success("Removed from wishlist");
                      }}
                      className="
                        text-red-500
                        transition
                        hover:underline
                      "
                    >
                      Remove
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
