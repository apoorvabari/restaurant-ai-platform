import React from "react";
import AnimatedLoader from "./AnimatedLoader";

const SkeletonLoader = ({ type = "card", count = 3 }) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl overflow-hidden">
            <div className="h-48 bg-slate-700/50 animate-pulse" />
            <div className="p-5">
              <div className="h-4 bg-slate-700/50 rounded mb-3 w-3/4 animate-pulse" />
              <div className="h-3 bg-slate-700/50 rounded mb-2 w-1/2 animate-pulse" />
              <div className="flex justify-between">
                <div className="h-8 bg-slate-700/50 rounded w-20 animate-pulse" />
                <div className="h-6 bg-slate-700/50 rounded w-16 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "row") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-700/50 rounded-lg animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-slate-700/50 rounded mb-2 w-3/4 animate-pulse" />
                <div className="h-3 bg-slate-700/50 rounded w-1/2 animate-pulse" />
              </div>
              <div className="w-16 h-8 bg-slate-700/50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback to animated loader for single loading state
  return <AnimatedLoader type="pulse" size="large" />;
};

export default SkeletonLoader;
