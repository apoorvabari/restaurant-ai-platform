import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReservations, deleteReservation } from "../features/reservations/reservationSlice";
import { Calendar, Clock, Users, AlertCircle, CalendarCheck, Loader2, Trash2 } from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";

const statusStyles = {
  BOOKED: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  CONFIRMED: "bg-green-500/10 border-green-500/20 text-green-400",
  ON_GOING: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  CANCELLED: "bg-red-500/10 border-red-500/20 text-red-400",
  COMPLETED: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  EXPIRED: "bg-gray-500/10 border-gray-500/20 text-gray-400",
  NO_SHOW: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  PENDING: "bg-amber-500/10 border-amber-500/20 text-amber-400",
};

const ReservationTracker = () => {
  const dispatch = useDispatch();
  const { list: reservations, status, error } = useSelector((state) => state.reservations);

  const handleDelete = (reservationId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      dispatch(deleteReservation(reservationId));
    }
  };

  useEffect(() => {
    dispatch(fetchReservations());
    
    // Poll for updates every 30 seconds to reflect status changes
    const interval = setInterval(() => {
      dispatch(fetchReservations());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="space-y-3">
        <SkeletonLoader type="row" count={3} />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="glass-card p-12 text-center">
        <Calendar className="w-12 h-12 text-brand-400 mx-auto mb-6" />
        <blockquote className="text-xl md:text-2xl font-medium text-white mb-4 heading-elegant">
          "A table is the only place where one is never lonely."
        </blockquote>
        <cite className="text-slate-400">— Anthony Bourdain</cite>
        <p className="text-sm text-slate-500 mt-6">Unable to load reservations at the moment. Please try again later.</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <CalendarCheck className="w-7 h-7 text-slate-600" />
        </div>
        <p className="text-lg font-medium text-slate-400">No reservations yet</p>
        <p className="text-sm text-slate-600 mt-1">Book a table to see your reservations here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <CalendarCheck className="w-5 h-5 text-brand-400" />
        Your Reservations
      </h3>

      {reservations.map((res, i) => (
        <div
          key={res.id || i}
          className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {/* Date badge */}
          <div className="w-14 h-14 rounded-xl bg-brand-500/10 border border-brand-500/20 flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-brand-400 leading-none">
              {res.reservationDate ? new Date(res.reservationDate + "T00:00").getDate() : "--"}
            </span>
            <span className="text-[10px] text-brand-400/60 uppercase font-medium">
              {res.reservationDate ? new Date(res.reservationDate + "T00:00").toLocaleDateString("en", { month: "short" }) : "--"}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                {res.reservationTime || "--:--"}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-400" />
                {res.numberOfGuests} guest{res.numberOfGuests !== 1 ? "s" : ""}
              </span>
              {res.tableNumber && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  Table {res.tableNumber}
                </span>
              )}
              {res.durationHours && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  {res.durationHours}h
                </span>
              )}
            </div>
          </div>

          {/* Status */}
          <span className={`status-badge border self-start ${statusStyles[res.status] || statusStyles.PENDING}`}>
            {res.status || "PENDING"}
          </span>

          {/* Delete button */}
          <button
            onClick={(e) => handleDelete(res.id, e)}
            className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
            title="Delete reservation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReservationTracker;