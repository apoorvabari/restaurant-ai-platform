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
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      {/* Ambient lights */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-500/20">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white heading-elegant">Create Account</h2>
          <p className="text-slate-500 mt-1">Join us for an amazing dining experience</p>
        </div>

        {/* Form Card */}
        <div className="glass p-8 rounded-3xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center animate-fade-in">
              {typeof error === 'object' ? (error.token || error.message || 'Registration failed') : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                className="glass-input pl-11"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                id="register-name"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                className="glass-input pl-11"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                id="register-email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  className="glass-input pl-11 pr-11"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  id="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter */}
              {formData.password && (
                <div className="mt-2.5 space-y-1.5 animate-fade-in">
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
                    strength.level === 1 ? "text-red-400" : strength.level === 2 ? "text-amber-400" : "text-green-400"
                  }`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                className={`glass-input pl-11 pr-11 ${
                  passwordsMatch ? "border-green-500/30 focus:border-green-500/50" :
                  passwordsMismatch ? "border-red-500/30 focus:border-red-500/50" : ""
                }`}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                id="register-confirm-password"
              />
              {passwordsMatch && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-xs font-medium">✓ Match</span>
              )}
              {passwordsMismatch && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-xs font-medium">✗ Mismatch</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading" || passwordsMismatch}
              className="btn-primary w-full flex items-center justify-center gap-2"
              id="register-submit"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "REGISTER"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-600">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;