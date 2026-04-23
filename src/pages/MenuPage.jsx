import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../features/menu/menuSlice";
import MenuList from "../components/MenuList";
import { Search, Grid3X3, List, X, Utensils, Pizza, Soup, Coffee, Cake, Lock, LogIn, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const MenuPage = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.menu);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMenu());
    }
  }, [dispatch, status]);

  // Refresh menu when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMenu());
      setLastUpdated(new Date());
    }
  }, [dispatch,isAuthenticated]);

  // Auto-refresh every 60 seconds to sync with database
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchMenu());
      setLastUpdated(new Date());
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMenu());
    setLastUpdated(new Date());
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(items.map((item) => item.category).filter(Boolean))];
    return ["All", ...cats];
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  return (
    <div className="relative min-h-screen pt-8 pb-20 overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black">
      {/* Deep, blurred dark background with glowing orbs */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Blurred glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" style={{
          boxShadow: '0 0 100px rgba(251, 191, 36, 0.3), 0 0 200px rgba(251, 191, 36, 0.1)',
        }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl" style={{
          boxShadow: '0 0 80px rgba(249, 115, 22, 0.3), 0 0 160px rgba(249, 115, 22, 0.1)',
        }} />
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-yellow-400/10 rounded-full blur-3xl" style={{
          boxShadow: '0 0 90px rgba(250, 204, 21, 0.2), 0 0 180px rgba(250, 204, 21, 0.1)',
        }} />
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-white/5 rounded-full blur-3xl" style={{
          boxShadow: '0 0 60px rgba(255, 255, 255, 0.2), 0 0 120px rgba(255, 255, 255, 0.1)',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" style={{
          boxShadow: '0 0 150px rgba(217, 119, 6, 0.2), 0 0 300px rgba(217, 119, 6, 0.1)',
        }} />
      </div>

      {/* Reflective dark surface */}
      <div className="fixed bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-slate-900/50 to-transparent pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.02) 4px, rgba(255,255,255,0.02) 8px)`,
      }} />

      {/* Martini glass with clear liquid */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-none">
        {/* Glass stem */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-32 bg-gradient-to-t from-slate-400/30 to-slate-300/20" />
        {/* Glass base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-gradient-to-b from-slate-400/40 to-slate-500/50 rounded-full" style={{
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.05)',
        }} />
        {/* Glass bowl with liquid */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-32 h-24 bg-gradient-to-b from-white/20 via-white/10 to-white/5 rounded-b-full" style={{
          boxShadow: '0 0 40px rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(4px)',
        }}>
          {/* Liquid level */}
          <div className="absolute bottom-0 left-2 right-2 h-16 bg-gradient-to-t from-white/15 via-white/10 to-transparent rounded-b-full" />
          {/* Glass highlight */}
          <div className="absolute top-2 left-4 w-3 h-12 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
        </div>
        {/* Glass rim */}
        <div className="absolute bottom-48 left-1/2 -translate-x-1/2 w-36 h-2 bg-gradient-to-b from-slate-300/30 to-transparent rounded-full" style={{
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.15)',
        }} />
        {/* Olive garnish */}
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full" style={{
          boxShadow: '0 0 10px rgba(22, 163, 74, 0.5)',
        }} />
      </div>

      {/* Warm ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-gradient-to-b from-amber-500/20 to-transparent blur-2xl" />
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-gradient-to-b from-yellow-500/15 to-transparent blur-2xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-orange-500/10 to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant">
            OUR <span className="gradient-text">MENU</span>
          </h1>
          <p className="text-amber-300/70 text-lg mt-2 font-medium tracking-wide">
            ~ Crafted with Elegance ~
          </p>
        </div>

        {/* Login Prompt for Non-Authenticated Users */}
        {!isAuthenticated && (
          <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.03s" }}>
            <div className="bg-slate-900/80 rounded-2xl p-6 border border-amber-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Unlock Full Menu & Reservations</h3>
                    <p className="text-sm text-slate-400">Login to view detailed menu, place orders, and reserve tables</p>
                  </div>
                </div>
                <Link to="/login" className="btn-primary flex items-center gap-2 whitespace-nowrap">
                  <LogIn className="w-4 h-4" />
                  Login Now
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Menu Overview Section */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="bg-slate-900/80 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-amber-500/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-stone-500/5 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center heading-elegant">
                What We Serve
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 p-6 rounded-2xl text-center hover:bg-slate-700/60 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-stone-600 mx-auto mb-3 flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-amber-400 font-bold mb-1">Main Course</h3>
                  <p className="text-xs text-amber-200/70">Hearty & satisfying meals</p>
                </div>

                <div className="bg-slate-800/60 p-6 rounded-2xl text-center hover:bg-slate-700/60 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 mx-auto mb-3 flex items-center justify-center">
                    <Pizza className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-pink-400 font-bold mb-1">Appetizers</h3>
                  <p className="text-xs text-pink-200/70">Perfect starters to begin</p>
                </div>

                <div className="bg-slate-800/60 p-6 rounded-2xl text-center hover:bg-slate-700/60 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 mx-auto mb-3 flex items-center justify-center">
                    <Soup className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-cyan-400 font-bold mb-1">Soups & Salads</h3>
                  <p className="text-xs text-cyan-200/70">Fresh & healthy options</p>
                </div>

                <div className="bg-slate-800/60 p-6 rounded-2xl text-center hover:bg-slate-700/60 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 mx-auto mb-3 flex items-center justify-center">
                    <Cake className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-orange-400 font-bold mb-1">Desserts</h3>
                  <p className="text-xs text-orange-200/70">Sweet endings to your meal</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-800/60 rounded-2xl border border-white/10">
                <p className="text-amber-200/80 text-sm leading-relaxed text-center">
                  From classic comfort food to gourmet specialties, our menu features a diverse selection of dishes crafted with the finest ingredients. Whether you're craving a juicy burger, fresh pasta, exotic Asian cuisine, or decadent desserts, we have something to satisfy every palate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/60 border border-white/10 rounded-xl pl-12 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
              id="menu-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-6 animate-fade-in" style={{ animationDelay: "0.12s" }}>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${status === "loading" ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Last Updated Indicator */}
        {lastUpdated && (
          <p className="text-xs text-slate-600 mb-4 text-right animate-fade-in" style={{ animationDelay: "0.13s" }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm font-medium rounded-xl border transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(searchQuery || activeCategory !== "All") && (
          <p className="text-sm text-slate-500 mb-6 text-center animate-fade-in">
            Showing {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"}
            {activeCategory !== "All" && ` in ${activeCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        )}

        {/* Menu Grid */}
        <MenuList
          items={filteredItems}
          status={status}
          limit={isAuthenticated ? null : 6}
        />

        {/* Show More Items Prompt for Non-Authenticated Users */}
        {!isAuthenticated && filteredItems.length > 6 && (
          <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-sm text-slate-500 mb-4">
              Showing 6 of {filteredItems.length} dishes
            </p>
            <Link to="/login" className="btn-secondary inline-flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login to View Full Menu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;