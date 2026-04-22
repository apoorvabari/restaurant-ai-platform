import React from "react";

const SkeletonCard = () => (
  <div className="skeleton rounded-2xl overflow-hidden">
    <div className="h-56 bg-white/[0.03]" />
    <div className="p-6 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 w-32 bg-white/[0.06] rounded-lg" />
        <div className="h-5 w-16 bg-white/[0.06] rounded-lg" />
      </div>
      <div className="h-4 w-full bg-white/[0.04] rounded-lg" />
      <div className="h-4 w-2/3 bg-white/[0.04] rounded-lg" />
      <div className="h-6 w-20 bg-white/[0.06] rounded-full mt-2" />
    </div>
  </div>
);

const SkeletonRow = () => (
  <div className="skeleton flex items-center gap-4 p-4">
    <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-40 bg-white/[0.06] rounded-lg" />
      <div className="h-3 w-24 bg-white/[0.04] rounded-lg" />
    </div>
    <div className="h-6 w-16 bg-white/[0.06] rounded-full" />
  </div>
);

const SkeletonLoader = ({ type = "card", count = 3 }) => {
  const Component = type === "card" ? SkeletonCard : SkeletonRow;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </>
  );
};

export default SkeletonLoader;
