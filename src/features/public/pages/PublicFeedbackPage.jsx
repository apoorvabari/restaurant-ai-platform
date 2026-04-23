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
      <div className="relative min-h-screen py-12 px-4 overflow-hidden bg-gradient-to-br from-stone-950 via-neutral-950 to-black">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-stone-950/70 p-12 text-center border border-amber-700/30 rounded-3xl">
            <MessageSquare className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <p className="text-stone-300">Unable to load feedback at the moment. Please try again later.</p>
            {error && <p className="text-red-400 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-12 px-4 overflow-hidden bg-gradient-to-br from-stone-950 via-neutral-950 to-black">
      {/* Deep contrasting dark walls */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/95 via-neutral-900/90 to-stone-950/95" />
      </div>

      {/* Ornate pendant lights with perforated patterns */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${12 + i * 20}%`,
              top: '0',
            }}
          >
            {/* Cord */}
            <div className="w-0.5 h-40 bg-gradient-to-b from-stone-700 to-stone-800 mx-auto" />
            {/* Ornate bronze lamp shade with perforated pattern */}
            <div className="w-20 h-12 rounded-b-full mx-auto" style={{
              background: 'linear-gradient(180deg, #b45309 0%, #92400e 50%, #78350f 100%)',
              boxShadow: '0 0 40px rgba(251, 191, 36, 0.5), 0 0 80px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)',
            }}>
              {/* Perforated pattern dots */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-30">
                <div className="w-1 h-1 rounded-full bg-black" />
                <div className="w-1 h-1 rounded-full bg-black" />
                <div className="w-1 h-1 rounded-full bg-black" />
              </div>
            </div>
            {/* Warm golden glow from lamp */}
            <div className="w-16 h-16 rounded-full mx-auto -mt-4" style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(251, 191, 36, 0.2) 50%, transparent 70%)',
            }} />
          </div>
        ))}
      </div>

      {/* Symmetrical shadow patterns on walls */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-1/2" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(251, 191, 36, 0.05) 60px, rgba(251, 191, 36, 0.05) 120px), repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(251, 191, 36, 0.03) 40px, rgba(251, 191, 36, 0.03) 80px)`,
        }} />
        <div className="absolute bottom-0 left-0 w-full h-1/3" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(251, 191, 36, 0.08) 60px, rgba(251, 191, 36, 0.08) 120px), repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(251, 191, 36, 0.05) 40px, rgba(251, 191, 36, 0.05) 80px)`,
        }} />
      </div>

      {/* Warm ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant mb-4 text-white">
            Customer <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Feedback</span>
          </h1>
          <p className="text-stone-300 text-lg">
            Share your experience and see what our customers are saying about us
          </p>
        </div>

        {/* Feedback Form */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <FeedbackForm />
        </div>

        {/* Feedback List Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
          <h2 className="text-2xl font-bold text-white heading-elegant">Recent Reviews</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        </div>

        {/* Feedback List */}
        {feedback.length === 0 ? (
          <div className="bg-stone-950/70 p-12 text-center border border-amber-700/30 rounded-3xl animate-fade-in">
            <MessageSquare className="w-16 h-16 text-stone-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-stone-300">No feedback yet</p>
            <p className="text-sm text-stone-500 mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedback.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-stone-900/50 p-6 animate-fade-in border border-stone-700/50 rounded-2xl backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= item.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-stone-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-white mb-4 line-clamp-4">
                  {item.comment}
                </p>

                {/* Customer Name */}
                <div className="flex items-center gap-2 text-sm text-stone-400 mb-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  <span>{item.customerName}</span>
                </div>

                {/* Date */}
                {item.createdAt && (
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Calendar className="w-3 h-3 text-amber-500" />
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
