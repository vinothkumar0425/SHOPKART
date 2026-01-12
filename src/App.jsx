import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/* Pages */
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Invoice from "./pages/Invoice";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";

/* Contexts */
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext";

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>

              {/* 🔔 GLOBAL RESPONSIVE TOAST */}
              <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={12}
                toastOptions={{
                  duration: 2500,
                  style: {
                    background: "#0f172a",
                    color: "#ffffff",
                    borderRadius: "14px",
                    padding: "14px 16px",
                    fontWeight: 500,
                    zIndex: 99999,
                  },
                  success: {
                    iconTheme: {
                      primary: "#22c55e",
                      secondary: "#ecfdf5",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fef2f2",
                    },
                  },
                }}
                containerStyle={{
                  zIndex: 99999,
                  top: 80,
                  right: 16,
                }}
              />

              <Navbar />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route
                  path="/cart"
                  element={<ProtectedRoute><Cart /></ProtectedRoute>}
                />
                <Route
                  path="/wishlist"
                  element={<ProtectedRoute><Wishlist /></ProtectedRoute>}
                />
                <Route
                  path="/checkout"
                  element={<ProtectedRoute><Checkout /></ProtectedRoute>}
                />
                <Route
                  path="/orders"
                  element={<ProtectedRoute><Orders /></ProtectedRoute>}
                />
                <Route
                  path="/invoice/:id"
                  element={<ProtectedRoute><Invoice /></ProtectedRoute>}
                />
                <Route
                  path="/order-success"
                  element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute><Profile /></ProtectedRoute>}
                />
                <Route
                  path="/admin"
                  element={<ProtectedRoute><Admin /></ProtectedRoute>}
                />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>

            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
