import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount, toggleCart } from "../features/cart/cartSlice";
import { logout } from "../features/auth/authSlice";
import { ShoppingCart, Menu, X, ChefHat, LogOut, User, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { loginWithRedirect, logout: auth0Logout, user: auth0User, isAuthenticated: auth0Authenticated } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useSelector(selectCartCount);
  const { isAuthenticated, user, authMode } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (authMode === 'local') {
      dispatch(logout());
      navigate('/');
    } else {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/reservations", label: "Reservations" },
    { to: "/orders", label: "Orders" },
  ];

  const authenticatedLinks = [
    { to: "/feedback", label: "Feedback" },
  ];

  const isAdmin = user?.role === 'ADMIN';

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-black/60 backdrop-blur-lg border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow duration-300">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none heading-elegant">APOORVA</h1>
            <p className="text-[10px] font-medium text-brand-400 tracking-[0.2em]">RESTAURANT</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                isActive(link.to)
                  ? "text-brand-400 bg-brand-500/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-400 rounded-full" />
              )}
            </Link>
          ))}
          {isAuthenticated && authenticatedLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                isActive(link.to)
                  ? "text-brand-400 bg-brand-500/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-400 rounded-full" />
              )}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 flex items-center gap-1.5 ${
                isActive("/dashboard")
                  ? "text-brand-400 bg-brand-500/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          )}
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
          {/* Cart Button */}
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative p-2.5 rounded-xl hover:bg-white/5 transition-all duration-300 group"
            id="cart-button"
          >
            <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in shadow-lg shadow-brand-500/50">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 rounded-xl font-semibold text-sm text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all duration-300"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-500/10 to-accent-500/10 border border-brand-500/20">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-white">
                  {user?.name || user?.email?.split('@')[0] || "User"}
                </span>
              </div>
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
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl animate-fade-in">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive(link.to)
                    ? "text-brand-400 bg-brand-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && authenticatedLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive(link.to)
                    ? "text-brand-400 bg-brand-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="block px-4 py-3 text-sm font-medium rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-3 text-sm font-medium rounded-xl text-slate-300 hover:text-red-400 hover:bg-white/5"
              >
                Admin
              </Link>
            )}
            <div className="pt-3 border-t border-white/10 mt-3">
              {!isAuthenticated ? (
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <span className="text-sm text-slate-500">Not logged in</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-3 px-3 py-2 rounded-xl bg-gradient-to-r from-brand-500/10 to-accent-500/10 border border-brand-500/20">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {user?.name || user?.email?.split('@')[0] || "User"}
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="flex-1 text-center py-3 text-sm font-medium rounded-xl border border-white/10 text-white hover:bg-white/5">Login</Link>
                    <Link to="/register" className="flex-1 text-center py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white">Register</Link>
                  </>
                ) : (
                  <button onClick={handleLogout} className="w-full py-3 text-sm font-medium text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10">
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