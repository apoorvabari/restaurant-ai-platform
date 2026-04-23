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
      <div className="relative min-h-screen pt-8 pb-20 overflow-hidden bg-gradient-to-b from-amber-950 via-amber-900 to-stone-950">
        {/* Deep brown wood paneling walls */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/90 via-stone-900/80 to-amber-950/90" />
        </div>

        {/* Wood paneling texture */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-amber-950/60 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-amber-950/60 to-transparent" />
        </div>

        {/* Wood grain pattern */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(139, 69, 19, 0.1) 4px, rgba(139, 69, 19, 0.1) 8px)`,
        }} />

        {/* Hanging pendant lights with amber glass shades */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${15 + i * 18}%`,
                top: '0',
              }}
            >
              {/* Cord */}
              <div className="w-0.5 h-28 bg-gradient-to-b from-amber-800 to-amber-900 mx-auto" />
              {/* Amber glass shade */}
              <div className="w-10 h-6 bg-gradient-to-b from-amber-600/60 to-amber-700/80 rounded-b-full mx-auto" style={{
                boxShadow: '0 0 20px rgba(251, 191, 36, 0.4), inset 0 0 10px rgba(251, 191, 36, 0.2)',
              }} />
              {/* Warm golden glow */}
              <div className="w-8 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full mx-auto -mt-1" style={{
                boxShadow: '0 0 40px rgba(251, 191, 36, 0.8), 0 0 80px rgba(251, 191, 36, 0.4)',
              }} />
            </div>
          ))}
        </div>

        {/* Large framed artworks on walls */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute left-12 top-24">
            <div className="w-32 h-40 bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg" style={{
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.3), inset 0 0 15px rgba(0,0,0,0.5)',
              border: '4px solid #5c3d2e',
            }}>
              <div className="absolute inset-2 bg-gradient-to-br from-amber-700/50 to-stone-800/50" />
            </div>
          </div>
          <div className="absolute left-12 top-80">
            <div className="w-32 h-40 bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg" style={{
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.3), inset 0 0 15px rgba(0,0,0,0.5)',
              border: '4px solid #5c3d2e',
            }}>
              <div className="absolute inset-2 bg-gradient-to-br from-amber-700/50 to-stone-800/50" />
            </div>
          </div>
          <div className="absolute right-12 top-24">
            <div className="w-32 h-40 bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg" style={{
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.3), inset 0 0 15px rgba(0,0,0,0.5)',
              border: '4px solid #5c3d2e',
            }}>
              <div className="absolute inset-2 bg-gradient-to-br from-amber-700/50 to-stone-800/50" />
            </div>
          </div>
        </div>

        {/* Bar counter on left side */}
        <div className="fixed left-0 top-1/3 bottom-0 w-24 bg-gradient-to-r from-amber-950 via-amber-900 to-transparent pointer-events-none z-0" />
        <div className="fixed left-0 top-1/3 bottom-0 w-20 bg-gradient-to-b from-amber-800 to-amber-950 pointer-events-none z-0" style={{
          boxShadow: '0 0 30px rgba(251, 191, 36, 0.2)',
        }} />

        {/* High stools at bar */}
        <div className="fixed left-4 bottom-20 pointer-events-none z-0">
          <div className="w-6 h-20 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-lg" />
          <div className="w-10 h-2 bg-amber-800 rounded-full -mt-1" />
        </div>
        <div className="fixed left-4 bottom-36 pointer-events-none z-0">
          <div className="w-6 h-20 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-lg" />
          <div className="w-10 h-2 bg-amber-800 rounded-full -mt-1" />
        </div>

        {/* Subtle window reflections */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute right-0 top-1/4 bottom-1/4 w-32 bg-gradient-to-l from-amber-200/5 to-transparent" />
          <div className="absolute right-4 top-1/3 w-24 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />
          <div className="absolute right-4 top-1/2 w-24 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />
          <div className="absolute right-4 top-2/3 w-24 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />
        </div>

        {/* Ambient warm glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant text-white">
              RESERVE A <span className="text-blue-500">TABLE</span>
            </h1>
          </div>

          {/* Quote for non-authenticated users */}
          <div className="bg-amber-950/70 backdrop-blur-md p-12 text-center animate-fade-in rounded-3xl border border-amber-700/50 shadow-2xl">
            <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-white mb-4 heading-elegant">
              "Dining is an art, and the table is the canvas."
            </blockquote>
            <cite className="text-blue-300">— Unknown</cite>
            <div className="mt-8 pt-8 border-t border-amber-700/50">
              <p className="text-blue-200 mb-4">Sign in to book your table and track reservations</p>
              <RouterLink
                to="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
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
    <div className="relative min-h-screen pt-8 pb-20 overflow-hidden bg-gradient-to-b from-amber-950 via-amber-900 to-stone-950">
      {/* Deep brown wood paneling walls */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/90 via-stone-900/80 to-amber-950/90" />
      </div>

      {/* Wood paneling texture */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-amber-950/60 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-amber-950/60 to-transparent" />
      </div>

      {/* Wood grain pattern */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(139, 69, 19, 0.1) 4px, rgba(139, 69, 19, 0.1) 8px)`,
      }} />

      {/* Hanging pendant lights with amber glass shades */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 18}%`,
              top: '0',
            }}
          >
            {/* Cord */}
            <div className="w-0.5 h-28 bg-gradient-to-b from-amber-800 to-amber-900 mx-auto" />
            {/* Amber glass shade */}
            <div className="w-10 h-6 bg-gradient-to-b from-amber-600/60 to-amber-700/80 rounded-b-full mx-auto" style={{
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.4), inset 0 0 10px rgba(251, 191, 36, 0.2)',
            }} />
            {/* Warm golden glow */}
            <div className="w-8 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full mx-auto -mt-1" style={{
              boxShadow: '0 0 40px rgba(251, 191, 36, 0.8), 0 0 80px rgba(251, 191, 36, 0.4)',
            }} />
          </div>
        ))}
      </div>

      {/* Large framed artworks on walls */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-12 top-24">
          <div className="w-32 h-40 bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg" style={{
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.3), inset 0 0 15px rgba(0,0,0,0.5)',
            border: '4px solid #5c3d2e',
          }}>
            <div className="absolute inset-2 bg-gradient-to-br from-amber-700/50 to-stone-800/50" />
          </div>
        </div>
        <div className="absolute left-12 top-80">
          <div className="w-32 h-40 bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg" style={{
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.3), inset 0 0 15px rgba(0,0,0,0.5)',
            border: '4px solid #5c3d2e',
          }}>
            <div className="absolute inset-2 bg-gradient-to-br from-amber-700/50 to-stone-800/50" />
          </div>
        </div>
        <div className="absolute right-12 top-24">
          <div className="w-32 h-40 bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg" style={{
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.3), inset 0 0 15px rgba(0,0,0,0.5)',
            border: '4px solid #5c3d2e',
          }}>
            <div className="absolute inset-2 bg-gradient-to-br from-amber-700/50 to-stone-800/50" />
          </div>
        </div>
      </div>

      {/* Bar counter on left side */}
      <div className="fixed left-0 top-1/3 bottom-0 w-24 bg-gradient-to-r from-amber-950 via-amber-900 to-transparent pointer-events-none z-0" />
      <div className="fixed left-0 top-1/3 bottom-0 w-20 bg-gradient-to-b from-amber-800 to-amber-950 pointer-events-none z-0" style={{
        boxShadow: '0 0 30px rgba(251, 191, 36, 0.2)',
      }} />

      {/* High stools at bar */}
      <div className="fixed left-4 bottom-20 pointer-events-none z-0">
        <div className="w-6 h-20 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-lg" />
        <div className="w-10 h-2 bg-amber-800 rounded-full -mt-1" />
      </div>
      <div className="fixed left-4 bottom-36 pointer-events-none z-0">
        <div className="w-6 h-20 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-lg" />
        <div className="w-10 h-2 bg-amber-800 rounded-full -mt-1" />
      </div>

      {/* Subtle window reflections */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute right-0 top-1/4 bottom-1/4 w-32 bg-gradient-to-l from-amber-200/5 to-transparent" />
        <div className="absolute right-4 top-1/3 w-24 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />
        <div className="absolute right-4 top-1/2 w-24 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />
        <div className="absolute right-4 top-2/3 w-24 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />
      </div>

      {/* Ambient warm glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant text-white">
            RESERVE A <span className="text-blue-500">TABLE</span>
          </h1>
          <p className="text-blue-200 text-lg mt-2">
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
            <div className="bg-amber-950/70 backdrop-blur-md rounded-3xl p-8 border border-amber-700/50 shadow-2xl">
              <ReservationTracker />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
