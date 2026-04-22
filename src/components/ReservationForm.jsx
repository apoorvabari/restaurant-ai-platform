import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReservation, fetchReservations } from "../features/reservations/reservationSlice";
import { fetchTables } from "../features/tables/tableSlice";
import { User, Phone, Users, Calendar, Clock, MessageSquare, CheckCircle, Loader2, Table, AlertCircle } from "lucide-react";

const ReservationForm = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.reservations);
  const { list: tables } = useSelector((state) => state.tables);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    numberOfGuests: 2,
    reservationDate: "",
    reservationTime: "",
    tableId: "",
    durationHours: 2,
    specialRequest: "",
  });

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      // Only allow digits and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  const handleGuestChange = (delta) => {
    setFormData((prev) => ({
      ...prev,
      numberOfGuests: Math.max(1, Math.min(20, prev.numberOfGuests + delta)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!formData.customerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    if (!formData.reservationDate) {
      setError("Please select a reservation date");
      return;
    }
    if (!formData.reservationTime) {
      setError("Please select a reservation time");
      return;
    }
    if (!formData.tableId) {
      setError("Please select a table");
      return;
    }

    // Check if the selected table is still available
    const selectedTable = tables.find(t => t.id === formData.tableId);
    if (selectedTable && selectedTable.status !== "AVAILABLE") {
      setError(`Table ${selectedTable.tableNumber} is ${selectedTable.status.toLowerCase()}. Please select a different table.`);
      return;
    }

    const result = await dispatch(createReservation(formData));
    if (!result.error) {
      dispatch(fetchTables()); // Refresh table statuses after booking
      dispatch(fetchReservations()); // Refresh reservations list after booking
      setSubmitted(true);
      setFormData({
        customerName: "",
        phoneNumber: "",
        numberOfGuests: 2,
        reservationDate: "",
        reservationTime: "",
        tableId: "",
        durationHours: 2,
        specialRequest: "",
      });
      setTimeout(() => setSubmitted(false), 4000);
    } else {
      setError(result.error.message || "Failed to create reservation. Please try again.");
    }
  };

  const timeSlots = [
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ];

  // Check if a time slot is in the past
  const isTimeSlotDisabled = (timeSlot) => {
    if (!formData.reservationDate) {
      // If no date selected, assume today and check time
      const now = new Date();
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      return slotTime <= now;
    }
    
    // Check if selected date is today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(formData.reservationDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate.getTime() === today.getTime()) {
      // If today, check if time has passed
      const now = new Date();
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      return slotTime <= now;
    }
    
    // Future date, all slots available
    return false;
  };

  return (
    <div className="glass rounded-3xl p-8 relative overflow-hidden">
      {/* Success overlay */}
      {submitted && (
        <div className="absolute inset-0 z-10 bg-surface/90 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Reservation Confirmed!</h3>
          <p className="text-sm text-slate-400 mt-1">We'll see you soon 🎉</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Calendar className="w-6 h-6 text-brand-400" />
        Book a Table
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            name="customerName"
            placeholder="Your Name"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="glass-input pl-11"
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number (10 digits)"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            maxLength="10"
            className="glass-input pl-11 pr-20"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
            {formData.phoneNumber.length}/10
          </span>
        </div>

        {/* Guests Stepper */}
        <div>
          <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Users className="w-4 h-4 text-brand-400" />
            Number of Guests
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleGuestChange(-1)}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center"
            >
              −
            </button>
            <span className="text-2xl font-bold text-white w-10 text-center">{formData.numberOfGuests}</span>
            <button
              type="button"
              onClick={() => handleGuestChange(1)}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Date */}
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="date"
            name="reservationDate"
            value={formData.reservationDate}
            onChange={handleChange}
            required
            className="glass-input pl-11"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Time Slots */}
        <div>
          <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Clock className="w-4 h-4 text-brand-400" />
            Select Time
          </label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => {
              const isDisabled = isTimeSlotDisabled(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => !isDisabled && setFormData({ ...formData, reservationTime: slot })}
                  disabled={isDisabled}
                  className={`py-2 text-xs font-medium rounded-xl border transition-all duration-300 ${
                    formData.reservationTime === slot
                      ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                      : isDisabled
                      ? "bg-slate-500/10 border-slate-500/20 text-slate-600 cursor-not-allowed"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {formData.reservationDate && new Date(formData.reservationDate).toDateString() === new Date().toDateString() && (
            <p className="text-xs text-slate-500 mt-2">
              ⚠️ Past time slots are disabled for today
            </p>
          )}
        </div>

        {/* Table Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Table className="w-4 h-4 text-brand-400" />
            Select Table <span className="text-red-400">*</span>
          </label>
          <select
            name="tableId"
            value={formData.tableId}
            onChange={handleChange}
            className="glass-input bg-surface/80 text-slate-900"
            required
          >
            <option value="">Select a table</option>
            {[...tables]
              .sort((a, b) => a.tableNumber - b.tableNumber)
              .map((table) => {
                const statusColor = {
                  AVAILABLE: "🟢",
                  BOOKED: "🟡",
                  OCCUPIED: "🔴",
                  EXPIRED: "⚪"
                }[table.status] || "⚪";
                const isDisabled = table.status !== "AVAILABLE";
                return (
                  <option 
                    key={table.id} 
                    value={table.id}
                    disabled={isDisabled}
                    className={isDisabled ? "text-slate-600" : "text-slate-900"}
                  >
                    {statusColor} Table {table.tableNumber} ({table.status}) - Capacity: {table.capacity}
                  </option>
                );
              })}
          </select>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Available</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Booked</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Occupied</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Expired</span>
          </div>
        </div>

        {/* Duration Hours */}
        <div>
          <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Clock className="w-4 h-4 text-brand-400" />
            Duration (hours)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setFormData({ ...formData, durationHours: hours })}
                className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all duration-300 ${
                  formData.durationHours === hours
                    ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                {hours}h
              </button>
            ))}
          </div>
        </div>

        {/* Special Request */}
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
          <textarea
            name="specialRequest"
            placeholder="Special requests (optional)"
            value={formData.specialRequest}
            onChange={handleChange}
            rows="3"
            className="glass-input pl-11 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Reserve Table"
          )}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
