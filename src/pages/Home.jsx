import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import ProductSkeleton from "../components/ProductSkeleton";
import { getProducts } from "../api/productsApi";

export default function Home() {
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  /* ================= FILTER ================= */
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= SORT ================= */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    return 0;
  });

  /* ================= EXPLORE ================= */
  const handleExplore = () => {
    if (products.length > 0) {
      navigate(`/product/${products[0].id}`);
    }
  };

  /* ================= PARALLAX ================= */
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    if (imageRef.current) {
      imageRef.current.style.transform = `
        translate(${x * 0.03}px, ${y * 0.03}px)
        scale(1.05)
      `;
    }
  };

  const resetTransform = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = "translate(0px,0px) scale(1)";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] relative z-0">

      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden bg-[#0f172a] text-white z-0">
        <div className="relative max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full bg-white/10 border border-white/20">
              🚀 Premium E-Commerce Experience
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Upgrade Your <span className="text-blue-400">Lifestyle</span><br />
              with Premium Products
            </h1>

            <p className="text-gray-300 max-w-xl mb-8">
              Discover high-quality gadgets and accessories crafted
              for performance, design and long-term reliability.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() =>
                  window.scrollTo({ top: 800, behavior: "smooth" })
                }
                className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
              >
                Shop Now
              </button>

              <button
                onClick={handleExplore}
                className="px-7 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition font-semibold"
              >
                Explore →
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="relative hidden md:block"
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTransform}
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
              <img
                ref={imageRef}
                src="https://m.media-amazon.com/images/I/61bK6PMOC3L._SX679_.jpg"
                alt="Featured Product"
                className="h-80 mx-auto object-contain transition-transform duration-300 ease-out"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">

        {/* SEARCH + SORT */}
        <div className="bg-white dark:bg-[#0f172a] border rounded-2xl shadow-lg p-5 flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
          <div className="w-full md:w-2/3">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full md:w-60 px-4 py-3 rounded-xl border dark:bg-[#020617]"
          >
            <option value="">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {/* PRODUCTS (✅ 2 COLUMN FIX) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
