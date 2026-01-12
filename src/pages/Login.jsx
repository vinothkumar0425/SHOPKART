// src/pages/Login.jsx
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../context/AuthContext";
import AuthLoader from "../components/AuthLoader";

export default function Login() {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Login successful");
      navigate("/");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Login successful");
      navigate("/");
    } catch {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      {loading && <AuthLoader />}

      <div className="
        w-full max-w-md
        bg-white dark:bg-slate-900
        rounded-3xl
        shadow-xl
        p-8
        animate-fadeIn
      ">
        {/* BRAND */}
        <h1 className="text-center text-2xl font-bold mb-2">
          SHOPKART
        </h1>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Login to access your cart, wishlist and orders
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-2">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* ✅ FORGOT PASSWORD LINK (NEW) */}
        <div className="text-right mb-5">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            bg-black text-white
            py-3
            rounded-xl
            font-semibold
            hover:opacity-90
            transition
            active:scale-95
            disabled:opacity-60
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700" />
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="
            w-full
            flex items-center justify-center gap-3
            border border-gray-300 dark:border-slate-700
            py-3
            rounded-xl
            font-medium
            hover:bg-gray-100 dark:hover:bg-slate-800
            transition
            active:scale-95
          "
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* REGISTER */}
        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
