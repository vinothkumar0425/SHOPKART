import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import Rating from "../components/Rating";
import { getProductById } from "../api/productsApi";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function ProductDetails() {
  const { id } = useParams();

  const { addToCart, cartItems } = useContext(CartContext);
  const { toggleWishlist, wishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    getProductById(id).then(setProduct);
  }, [id]);

  /* ================= FETCH REVIEWS ================= */
  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(
        collection(db, "products", id, "reviews"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      setReviews(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchReviews();
  }, [id]);

  if (!product) return <div className="p-10">Loading...</div>;

  const inCart = cartItems.some((i) => i.id === product.id);
  const inWishlist = wishlist.some((i) => i.id === product.id);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviews.length
      : 0;

  /* ================= SUBMIT REVIEW ================= */
  const submitReview = async () => {
    if (!user) {
      toast.error("Please login to submit review");
      return;
    }

    if (!userRating || !comment.trim()) {
      toast.error("Please give rating and review");
      return;
    }

    try {
      setLoadingReview(true);

      const userName =
        user.displayName ||
        user.email?.split("@")[0] ||
        "Anonymous User";

      await addDoc(
        collection(db, "products", id, "reviews"),
        {
          userId: user.uid,
          userName,
          rating: userRating,
          comment,
          createdAt: serverTimestamp(),
        }
      );

      setComment("");
      setUserRating(0);
      toast.success("Review submitted");

      const snap = await getDocs(
        query(
          collection(db, "products", id, "reviews"),
          orderBy("createdAt", "desc")
        )
      );

      setReviews(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setLoadingReview(false);
    }
  };

  return (
    /* 🔹 Page wrapper – NO background (global body handles dark bg) */
    <div className="max-w-6xl mx-auto px-6 py-10 bg-transparent">

      {/* 🔹 Main Card */}
      <div className="bg-white dark:bg-slate-900/95 backdrop-blur rounded-2xl p-8 shadow-xl">

        {/* ================= PRODUCT ================= */}
        <div className="grid md:grid-cols-2 gap-10">
          <img
            src={product.image}
            alt={product.name}
            className="h-72 mx-auto object-contain"
          />

          <div>
            <h1 className="text-2xl font-bold mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-3">
              <Rating value={Math.round(averageRating)} readOnly />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-2xl font-semibold mb-4">
              ₹ {product.price}
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {product.description}
            </p>

            <div className="flex gap-4">
              <button
                disabled={inCart}
                onClick={() => {
                  if (inCart) {
                    toast("Already in cart");
                    return;
                  }
                  addToCart(product);
                  toast.success("Added to cart");
                }}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  inCart
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-black text-white hover:opacity-90"
                }`}
              >
                {inCart ? "In Cart" : "Add to Cart"}
              </button>

              <button
                onClick={() => {
                  toggleWishlist(product);
                  toast.success(
                    inWishlist
                      ? "Removed from wishlist"
                      : "Added to wishlist"
                  );
                }}
                className={`text-2xl transition ${
                  inWishlist ? "text-red-500" : "text-gray-400"
                }`}
              >
                ♥
              </button>
            </div>

            <Link
              to="/"
              className="inline-block mt-6 text-blue-600 dark:text-blue-400 underline"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-10 border-gray-200 dark:border-slate-700" />

        {/* ================= REVIEWS ================= */}
        <div>
          <h2 className="text-xl font-bold mb-6">
            Customer Reviews
          </h2>

          {/* ADD REVIEW */}
          <div className="bg-gray-50 dark:bg-slate-800/80 p-6 rounded-xl mb-8">
            <Rating value={userRating} onChange={setUserRating} />

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="mt-4 w-full p-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700"
            />

            <button
              onClick={submitReview}
              disabled={loadingReview}
              className="mt-4 bg-black text-white px-6 py-2 rounded-lg"
            >
              {loadingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          {/* REVIEW LIST */}
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="border-b pb-4 dark:border-slate-700">
                <div className="flex justify-between mb-1">
                  <p className="font-semibold">
                    {r.userName || "Anonymous User"}
                  </p>
                  <Rating value={r.rating} readOnly />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
