import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFeedback } from "../../../features/feedback/feedbackSlice";
import FeedbackForm from "../../../components/FeedbackForm";
import { Star, MessageSquare, Calendar } from "lucide-react";

const PublicFeedbackPage = () => {
  const dispatch = useDispatch();
  const { list: feedback, status, error } = useSelector((state) => state.feedback);

  useEffect(() => {
    dispatch(fetchFeedback());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400">Loading feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-12 text-center">
            <MessageSquare className="w-12 h-12 text-brand-400 mx-auto mb-6" />
            <p className="text-slate-400">Unable to load feedback at the moment. Please try again later.</p>
            {error && <p className="text-red-400 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant mb-4">
            Customer <span className="gradient-text">Feedback</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Share your experience and see what our customers are saying about us
          </p>
        </div>

        {/* Feedback Form */}
        <div className="mb-16">
          <FeedbackForm />
        </div>

        {/* Feedback List Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>
          <h2 className="text-2xl font-bold text-white heading-elegant">Recent Reviews</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>
        </div>

        {/* Feedback List */}
        {feedback.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-400">No feedback yet</p>
            <p className="text-sm text-slate-600 mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedback.map((item, index) => (
              <div
                key={item.id || index}
                className="glass-card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= item.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-white mb-4 line-clamp-4">
                  {item.comment}
                </p>

                {/* Customer Name */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{item.customerName}</span>
                </div>

                {/* Date */}
                {item.createdAt && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicFeedbackPage;
