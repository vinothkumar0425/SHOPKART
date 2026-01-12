import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>

      {/* 🔔 THEME-AWARE TOASTER */}
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 2500,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-text)",
            border: "1px solid var(--toast-border)",
            borderRadius: "14px",
            padding: "14px 16px",
            fontWeight: 500,
            zIndex: 999999,
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#dcfce7",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fee2e2",
            },
          },
        }}
        containerStyle={{
          zIndex: 999999,
        }}
      />

      <App />
    </BrowserRouter>
  </React.StrictMode>
);
