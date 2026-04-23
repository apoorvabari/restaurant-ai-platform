import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ChefHat } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData)).then((res) => {
      if (!res.error) {
        alert("Login successful! Redirecting to orders...");
        navigate("/orders");
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden bg-gradient-to-b from-green-950 via-green-900 to-emerald-950">
      {/* Deep green foliage background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/95 via-green-900/90 to-green-950/95" />
      </div>

      {/* Foliage patterns */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-1/2" style={{
          backgroundImage: `radial-gradient(ellipse at 10% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
                       radial-gradient(ellipse at 90% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
                       radial-gradient(ellipse at 50% 10%, rgba(22, 163, 74, 0.1) 0%, transparent 50%)`,
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
          backgroundImage: `radial-gradient(ellipse at 20% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
                       radial-gradient(ellipse at 80% 90%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)`,
        }} />
      </div>

      {/* Tree branch with hanging lanterns */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/3">
          {/* Main branch */}
          <div className="absolute top-0 left-1/4 right-1/4 h-8 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-full" style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.3)',
          }} />
          {/* Branch texture */}
          <div className="absolute top-0 left-1/4 right-1/4 h-8 rounded-full" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0, 0, 0, 0.2) 10px, rgba(0, 0, 0, 0.2) 20px)`,
          }} />
        </div>
        
        {/* Hanging lanterns with cut-out patterns */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: '32px',
            }}
          >
            {/* Cord */}
            <div className="w-0.5 h-24 bg-gradient-to-b from-amber-700 to-amber-800 mx-auto" />
            {/* Cylindrical lantern */}
            <div className="w-12 h-20 rounded-lg mx-auto relative" style={{
              background: 'linear-gradient(180deg, #b45309 0%, #92400e 50%, #78350f 100%)',
              boxShadow: '0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.3), inset 0 0 15px rgba(0, 0, 0, 0.5)',
            }}>
              {/* Cut-out patterns */}
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 30%, transparent 2px, rgba(0, 0, 0, 0.4) 3px, transparent 4px),
                             radial-gradient(circle at 75% 30%, transparent 2px, rgba(0, 0, 0, 0.4) 3px, transparent 4px),
                             radial-gradient(circle at 50% 50%, transparent 2px, rgba(0, 0, 0, 0.4) 3px, transparent 4px),
                             radial-gradient(circle at 25% 70%, transparent 2px, rgba(0, 0, 0, 0.4) 3px, transparent 4px),
                             radial-gradient(circle at 75% 70%, transparent 2px, rgba(0, 0, 0, 0.4) 3px, transparent 4px),
                             radial-gradient(circle at 50% 85%, transparent 2px, rgba(0, 0, 0, 0.4) 3px, transparent 4px)`,
                backgroundSize: '100% 100%',
              }} />
              {/* Warm golden glow from inside */}
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
              }} />
            </div>
            {/* Projected light pattern below */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-16 h-32" style={{
              background: 'radial-gradient(ellipse at top, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
            }} />
          </div>
        ))}
      </div>

      {/* Wooden table and chair */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Table */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-4 rounded-full" style={{
          background: 'linear-gradient(180deg, #92400e 0%, #78350f 50%, #451a03 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
        }} />
        {/* Table legs */}
        <div className="absolute bottom-20 left-1/2 -translate-x-16 w-2 h-20 bg-gradient-to-b from-amber-700 to-amber-800" />
        <div className="absolute bottom-20 left-1/2 translate-x-14 w-2 h-20 bg-gradient-to-b from-amber-700 to-amber-800" />
        {/* Chair */}
        <div className="absolute bottom-24 left-1/2 -translate-x-24">
          <div className="w-4 h-24 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t" />
          <div className="w-12 h-2 bg-gradient-to-b from-amber-600 to-amber-700 rounded-t -mt-1" />
        </div>
        {/* Lantern on table */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <div className="w-8 h-12 rounded-lg" style={{
            background: 'linear-gradient(180deg, #b45309 0%, #92400e 50%, #78350f 100%)',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 191, 36, 0.2)',
          }}>
            {/* Cut-out pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, transparent 1px, rgba(0, 0, 0, 0.4) 2px, transparent 3px),
                           radial-gradient(circle at 30% 30%, transparent 1px, rgba(0, 0, 0, 0.4) 2px, transparent 3px),
                           radial-gradient(circle at 70% 30%, transparent 1px, rgba(0, 0, 0, 0.4) 2px, transparent 3px),
                           radial-gradient(circle at 30% 70%, transparent 1px, rgba(0, 0, 0, 0.4) 2px, transparent 3px),
                           radial-gradient(circle at 70% 70%, transparent 1px, rgba(0, 0, 0, 0.4) 2px, transparent 3px)`,
              backgroundSize: '100% 100%',
            }} />
          </div>
        </div>
      </div>

      {/* Golden amber highlights against night backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo - minimal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-100 tracking-tight mb-2">Welcome</h1>
          <p className="text-amber-200/70 text-sm font-light">Sign in to continue</p>
        </div>

        {/* Form - lantern-style card with warm tones */}
        <div className="bg-amber-950/70 backdrop-blur-sm p-8 rounded-2xl border border-amber-700/50 shadow-xl shadow-amber-500/20">
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-xs text-center">
              {typeof error === 'object' ? (error.token || error.message || 'Invalid credentials') : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                className="w-full bg-amber-900/50 border-2 border-amber-700/50 rounded-xl pl-12 pr-4 py-3.5 text-amber-100 placeholder:text-amber-500 focus:outline-none focus:border-amber-500 transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                id="login-email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                className="w-full bg-amber-900/50 border-2 border-amber-700/50 rounded-xl pl-12 pr-12 py-3.5 text-amber-100 placeholder:text-amber-500 focus:outline-none focus:border-amber-500 transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                id="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
              id="login-submit"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-amber-300/70 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-200 hover:text-amber-100 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;