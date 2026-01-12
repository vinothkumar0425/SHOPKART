import { NavLink } from "react-router-dom";

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow md:hidden flex justify-around py-2 z-50">

      <NavLink to="/" className="nav-icon">🏠 Home</NavLink>
      <NavLink to="/wishlist" className="nav-icon">❤️ Wishlist</NavLink>
      <NavLink to="/cart" className="nav-icon">🛒 Cart</NavLink>
      <NavLink to="/profile" className="nav-icon">👤 Profile</NavLink>

    </div>
  );
}
