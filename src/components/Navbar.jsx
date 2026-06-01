import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

import { selectCartCount, toggleCart } from "../features/cart/cartSlice";

import {
  ShoppingCart,
  Menu,
  X,
  ChefHat,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = useSelector(selectCartCount);

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll Effect
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Persist token & user to localStorage when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('authToken', user?.token || '');
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  }, [isAuthenticated, user]);

  // Updated logout handler to also clear localStorage


  const handleLogout = () => {
    dispatch(logout());
    navigate('/');

  };

  // Navigation Links
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/reservations", label: "Reservations" },
    { to: "/orders", label: "Orders" },
  ];

  const authenticatedLinks = [
    { to: "/feedback", label: "Feedback" },
  ];

  // Admin Check
  const isAdmin =
    user?.role === "ADMIN" ||
    user?.roles?.includes("ADMIN");

  // Active Route Check
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  // User Display
  const userDisplayName =
    user?.name ||
    user?.email?.split("@")?.[0] ||
    "User";

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-amber-950/90 backdrop-blur-xl border-b border-amber-800/30 shadow-lg shadow-amber-900/20"
          : "bg-amber-950/60 backdrop-blur-lg border-b border-amber-800/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow duration-300">
            <ChefHat className="w-5 h-5 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              APOORVA
            </h1>

            <p className="text-[10px] font-medium text-amber-400 tracking-[0.2em]">
              RESTAURANT
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                isActive(link.to)
                  ? "text-amber-400 bg-amber-500/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}

              {isActive(link.to) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
              )}
            </Link>
          ))}

          {isAuthenticated &&
            authenticatedLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive(link.to)
                    ? "text-amber-400 bg-amber-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}

                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                )}
              </Link>
            ))}

          {/* Admin Panel */}
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 flex items-center gap-1.5 ${
                isActive("/admin")
                  ? "text-red-400 bg-red-500/10"
                  : "text-slate-300 hover:text-red-400 hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative p-2.5 rounded-xl hover:bg-white/5 transition-all duration-300 group"
            id="cart-button"
          >
            <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />

            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
                {cartCount}
              </span>
            )}
          </button>

          {/* Desktop Auth */}
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-500" />
              </div>

              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-green-600 hover:from-amber-600 hover:to-green-700 rounded-xl font-semibold text-sm text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300"
                id="signin-button"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">

              {/* User Info */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-green-600/10 border border-amber-500/20">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                  {userInitial}
                </div>

                <span className="text-sm font-medium text-white">
                  {userDisplayName}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            id="mobile-menu-button"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-amber-950/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-1">

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive(link.to)
                    ? "text-amber-400 bg-amber-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Authenticated Links */}
            {isAuthenticated &&
              authenticatedLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive(link.to)
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

            {/* Admin */}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-3 text-sm font-medium rounded-xl text-slate-300 hover:text-red-400 hover:bg-white/5"
              >
                Admin Panel
              </Link>
            )}

            {/* Bottom Auth Section */}
            <div className="pt-3 border-t border-white/10 mt-3">

              {!isAuthenticated ? (
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>

                  <span className="text-sm text-slate-500">
                    Not signed in
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-3 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-green-600/10 border border-amber-500/20">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                    {userInitial}
                  </div>

                  <span className="text-sm font-medium text-white">
                    {userDisplayName}
                  </span>
                </div>
              )}

              <div className="flex gap-2">

                {!isAuthenticated ? (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full text-center py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-green-600 text-white"
                  >
                    Sign In
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 text-sm font-medium text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;