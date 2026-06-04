import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useKeycloak } from "@react-keycloak/web";
import { fetchReservations, deleteReservation } from "../features/reservations/reservationSlice";
import { Calendar, Clock, Users, AlertCircle, CalendarCheck, Loader2, Trash2 } from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";

const statusStyles = {
  BOOKED: "bg-amber-900/30 border-amber-700/50 text-amber-300",
  CONFIRMED: "bg-yellow-900/30 border-yellow-700/50 text-yellow-300",
  ON_GOING: "bg-orange-900/30 border-orange-700/50 text-orange-300",
  CANCELLED: "bg-red-900/30 border-red-700/50 text-red-300",
  COMPLETED: "bg-stone-900/30 border-stone-700/50 text-stone-300",
  EXPIRED: "bg-gray-900/30 border-gray-700/50 text-gray-400",
  NO_SHOW: "bg-purple-900/30 border-purple-700/50 text-purple-300",
  PENDING: "bg-amber-800/30 border-amber-600/50 text-amber-300",
};

const ReservationTracker = () => {
  const dispatch = useDispatch();
  const { keycloak, initialized } = useKeycloak();
  const { list: reservations, status, error } = useSelector((state) => state.reservations);

  const handleDelete = (reservationId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      dispatch(deleteReservation(reservationId));
    }
  };

  useEffect(() => {
    // Only fetch if Keycloak is ready and the user is authenticated
    if (!initialized || !keycloak.authenticated) return;

    dispatch(fetchReservations());

    // Poll for updates every 30 seconds to reflect status changes
    const interval = setInterval(() => {
      dispatch(fetchReservations());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, initialized, keycloak.authenticated]);

  if (status === "loading") {
    return (
      <div className="space-y-3">
        <SkeletonLoader type="row" count={3} />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-gray-950/70 p-12 text-center border border-gray-700/50 rounded-3xl">
        <Calendar className="w-12 h-12 text-amber-500 mx-auto mb-6" />
        <blockquote className="text-xl md:text-2xl font-medium text-white mb-4 heading-elegant">
          "A table is the only place where one is never lonely."
        </blockquote>
        <cite className="text-gray-300">— Anthony Bourdain</cite>
        <p className="text-sm text-gray-400 mt-6">Unable to load reservations at the moment. Please try again later.</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-gray-950/70 p-12 text-center border border-gray-700/50 rounded-3xl">
        <div className="w-16 h-16 rounded-full bg-gray-900/50 flex items-center justify-center mx-auto mb-4">
          <CalendarCheck className="w-7 h-7 text-amber-500" />
        </div>
        <p className="text-lg font-medium text-white">No reservations yet</p>
        <p className="text-sm text-gray-400 mt-1">Book a table to see your reservations here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <CalendarCheck className="w-5 h-5 text-amber-500" />
        Your Reservations
      </h3>

      {reservations.map((res, i) => (
        <div
          key={res.id || i}
          className="bg-gray-900/50 p-5 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in border border-gray-700/50 rounded-xl"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {/* Date badge */}
          <div className="w-14 h-14 rounded-xl bg-gray-800/50 border border-gray-600 flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-white leading-none">
              {res.reservationDate ? new Date(res.reservationDate + "T00:00").getDate() : "--"}
            </span>
            <span className="text-[10px] text-gray-300 uppercase font-medium">
              {res.reservationDate ? new Date(res.reservationDate + "T00:00").toLocaleDateString("en", { month: "short" }) : "--"}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {res.reservationTime || "--:--"}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                {res.numberOfGuests} guest{res.numberOfGuests !== 1 ? "s" : ""}
              </span>
              {res.tableNumber && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  Table {res.tableNumber}
                </span>
              )}
              {res.durationHours && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
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
            className="p-2 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors"
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