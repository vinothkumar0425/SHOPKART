import { NavLink } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `
      relative px-3 py-2 text-sm font-medium
      transition-colors
      ${
        isActive
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
      }
    `;

  return (
    <nav
      className="
        sticky top-0 z-50
        bg-white dark:bg-gray-900
        border-b border-gray-200 dark:border-gray-800
      "
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <NavLink
            to="/"
            className="text-xl font-extrabold tracking-wide text-blue-600"
          >
            SHOPKART
          </NavLink>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/wishlist" className={linkClass}>
              Wishlist
            </NavLink>

            <NavLink to="/cart" className={linkClass}>
              Cart
            </NavLink>

            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
