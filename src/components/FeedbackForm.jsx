import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitFeedback } from "../features/feedback/feedbackSlice";
import { Star, Send, AlertCircle, CheckCircle } from "lucide-react";

const FeedbackForm = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.feedback);

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    rating: 5,
    comment: "",
    orderId: "",
    reservationId: "",
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(submitFeedback(formData));
    if (result.meta.requestStatus === "fulfilled") {
      setShowSuccess(true);
      setFormData({
        customerName: "",
        email: "",
        rating: 5,
        comment: "",
        orderId: "",
        reservationId: "",
      });
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-stone-950/70 p-8 max-w-2xl mx-auto border border-amber-700/30 rounded-2xl backdrop-blur-md relative overflow-hidden">
      {/* Subtle warm glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl" />
      
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2 heading-elegant">
          Share Your Experience
        </h2>
        <p className="text-stone-300">
          Your feedback helps us improve our service
        </p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-700/50 rounded-lg flex items-center gap-3 text-emerald-400">
          <CheckCircle className="w-5 h-5" />
          <span>Thank you for your feedback!</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">
            Customer Name
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-stone-900/50 border border-stone-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-stone-500 transition-all"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-stone-900/50 border border-stone-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-stone-500 transition-all"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">
            Rating
          </label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-2 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || formData.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-stone-600"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">
            Comment
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-stone-900/50 border border-stone-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-stone-500 resize-none transition-all"
            placeholder="Share your experience with us..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Order ID (Optional)
            </label>
            <input
              type="text"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-stone-900/50 border border-stone-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-stone-500 transition-all"
              placeholder="Order ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Reservation ID (Optional)
            </label>
            <input
              type="number"
              name="reservationId"
              value={formData.reservationId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-stone-900/50 border border-stone-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-stone-500 transition-all"
              placeholder="Reservation ID"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            "Submitting..."
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
