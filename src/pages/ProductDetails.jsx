import { useParams, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  const inCart = cartItems.some((i) => i.id === product.id);
  const inWishlist = wishlist.some((i) => i.id === product.id);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviews.length
      : 0;

  /* ================= LOGIN GUARD ================= */
  const requireLogin = () => {
    toast.error("Please login to continue");
    navigate("/login");
  };

  /* ================= ACTIONS ================= */
  const handleAddToCart = () => {
    if (!user) return requireLogin();
    if (inCart) return toast("Already in cart");
    addToCart(product);
    toast.success("Added to cart");
  };

  const handleWishlist = () => {
    if (!user) return requireLogin();
    if (inWishlist) return toast("Already in wishlist");
    toggleWishlist(product);
    toast.success("Added to wishlist");
  };

  /* ================= SUBMIT REVIEW ================= */
  const submitReview = async () => {
    if (!user) return requireLogin();

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
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* ================= MAIN CARD ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl">

        {/* PRODUCT */}
        <div className="grid md:grid-cols-2 gap-10">
          <img
            src={product.image}
            alt={product.name}
            className="h-72 mx-auto object-contain"
          />

          <div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-3">
              <Rating value={Math.round(averageRating)} readOnly />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              ₹ {product.price}
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {product.description}
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={`px-6 py-2 rounded-lg font-medium transition
                  ${
                    inCart
                      ? "bg-gray-300 text-gray-600 dark:bg-slate-700 dark:text-gray-400"
                      : "bg-black text-white hover:opacity-90"
                  }`}
              >
                {inCart ? "In Cart" : "Add to Cart"}
              </button>

              <button
                onClick={handleWishlist}
                className={`text-2xl transition ${
                  inWishlist
                    ? "text-red-500"
                    : "text-gray-400 dark:text-gray-500"
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

        {/* ================= REVIEWS ================= */}
        <hr className="my-10 border-gray-200 dark:border-slate-700" />

        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Customer Reviews
        </h2>

        {/* ADD REVIEW CARD */}
        <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl mb-8">
          <Rating value={userRating} onChange={setUserRating} />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="
              mt-4 w-full p-3 rounded-lg border
              bg-white text-gray-900
              dark:bg-slate-900 dark:text-gray-100 dark:border-slate-700
            "
          />

          <button
            onClick={submitReview}
            disabled={loadingReview}
            className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            {loadingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* REVIEW LIST */}
        <div className="space-y-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="border-b border-gray-200 dark:border-slate-700 pb-4"
            >
              <div className="flex justify-between mb-1">
                <p className="font-semibold text-gray-900 dark:text-white">
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
  );
}
