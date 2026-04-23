import React from "react";
import FeedbackForm from "../../../components/FeedbackForm";

const FeedbackPage = () => {
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

      <div className="max-w-4xl mx-auto relative z-10">
        <FeedbackForm />
      </div>
    </div>
  );
};

export default FeedbackPage;
