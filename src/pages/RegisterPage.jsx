import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ChefHat, User, ShieldCheck } from "lucide-react";

const getPasswordStrength = (pw) => {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { level: 2, label: "Medium", color: "bg-amber-500" };
  return { level: 3, label: "Strong", color: "bg-green-500" };
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const strength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    dispatch(register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })).then((res) => {
      if (!res.error) {
        alert("Registration successful! Please login with your credentials.");
        navigate("/login");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative bg-slate-950">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo - minimal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Create Account</h1>
          <p className="text-yellow-400/70 text-sm font-light">Join us for an amazing dining experience</p>
        </div>

        {/* Form - minimal card */}
        <div className="bg-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-yellow-500/30">
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
              {typeof error === 'object' ? (error.token || error.message || 'Registration failed') : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                className="w-full bg-slate-800/50 border-2 border-yellow-500/30 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-yellow-400/50 focus:outline-none focus:border-yellow-400 transition-all"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                id="register-name"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                className="w-full bg-slate-800/50 border-2 border-yellow-500/30 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-yellow-400/50 focus:outline-none focus:border-yellow-400 transition-all"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                id="register-email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  className="w-full bg-slate-800/50 border-2 border-yellow-500/30 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder:text-yellow-400/50 focus:outline-none focus:border-yellow-400 transition-all"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  id="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Strength Meter */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          i <= strength.level ? strength.color : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength.level === 1 ? "text-red-400" : strength.level === 2 ? "text-yellow-400" : "text-green-400"
                  }`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                className={`w-full bg-slate-800/50 border-2 border-yellow-500/30 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder:text-yellow-400/50 focus:outline-none focus:border-yellow-400 transition-all ${
                  passwordsMatch ? "border-green-500/50 focus:border-green-400" :
                  passwordsMismatch ? "border-red-500/50 focus:border-red-400" : ""
                }`}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                id="register-confirm-password"
              />
              {passwordsMatch && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-xs font-medium">✓</span>
              )}
              {passwordsMismatch && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-xs font-medium">✗</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading" || passwordsMismatch}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              id="register-submit"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-yellow-400/60 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;