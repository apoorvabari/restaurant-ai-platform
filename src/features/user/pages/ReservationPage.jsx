import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservations } from "../../../features/reservations/reservationSlice";
import ReservationForm from "../../../components/ReservationForm";
import ReservationTracker from "../../../components/ReservationTracker";
import { CalendarDays, Sparkles, Link } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const ReservationsPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchReservations());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant">
              RESERVE A <span className="gradient-text">TABLE</span>
            </h1>
          </div>

          {/* Quote for non-authenticated users */}
          <div className="glass-card p-12 text-center animate-fade-in">
            <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-white mb-4 heading-elegant">
              "The best way to predict the future is to create it."
            </blockquote>
            <cite className="text-slate-400">— Peter Drucker</cite>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-slate-400 mb-4">Sign in to book your table and track reservations</p>
              <RouterLink
                to="/login"
                className="btn-primary inline-flex items-center gap-2"
              >
                Sign In to Book a Table
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant">
            RESERVE A <span className="gradient-text">TABLE</span>
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            Book your perfect dining experience
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <ReservationForm />
          </div>

          {/* Tracker */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="glass rounded-3xl p-8">
              <ReservationTracker />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
