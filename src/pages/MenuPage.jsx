import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../features/menu/menuSlice";
import MenuList from "../components/MenuList";
import {
  Search,
  X,
  Utensils,
  Pizza,
  Soup,
  Cake,
  Lock,
  LogIn,
  RefreshCw,
} from "lucide-react";


const MenuPage = () => {
  const dispatch = useDispatch();

  const {
    items = [],
    status,
    error,
  } = useSelector((state) => state.menu);

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [searchQuery, setSearchQuery] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [lastUpdated, setLastUpdated] =
    useState(null);

  /*
    FETCH MENU ONLY ON INITIAL LOAD
  */
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMenu());
      setLastUpdated(new Date());
    }
  }, [dispatch, status]);

  /*
    MANUAL REFRESH
  */
  const handleRefresh = () => {
    dispatch(fetchMenu());
    setLastUpdated(new Date());
  };

  /*
    NORMALIZED SEARCH
  */
  const normalizedSearch =
    searchQuery.toLowerCase();

  /*
    CATEGORY EXTRACTION
  */
  const categories = useMemo(() => {
    const cats = [
      ...new Set(
        items
          .map((item) => item?.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...cats];
  }, [items]);

  /*
    FILTERED ITEMS
  */
  const filteredItems = useMemo(() => {
    return items.filter((item) => {

      const matchesCategory =
        activeCategory === "All" ||
        item?.category?.trim() === activeCategory;

      const matchesSearch =
        !searchQuery ||
        item?.itemName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        item?.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      return (
        matchesCategory && matchesSearch
      );
    });
  }, [
    items,
    activeCategory,
    searchQuery,
    normalizedSearch,
  ]);

  /*
    LOADING UI
  */
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 animate-spin text-brand-400 mx-auto mb-4" />
          <p className="text-white text-lg">
            Loading Menu...
          </p>
        </div>
      </div>
    );
  }

  /*
    ERROR UI
  */
  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Failed To Load Menu
          </h2>

          <p className="text-slate-400 mb-6">
            {error || "Something went wrong"}
          </p>

          <button
            onClick={handleRefresh}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-12 animate-fade-in-up">

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant">
            OUR{" "}
            <span className="gradient-text">
              MENU
            </span>
          </h1>

          <p className="text-brand-400/60 text-lg mt-2 font-medium tracking-wide">
            ~ Fresh • Authentic • Delicious ~
          </p>

        </div>

        {/* LOGIN PROMPT */}
        {!isAuthenticated && (
          <div className="mb-8 animate-fade-in">

            <div className="glass rounded-2xl p-6 border border-brand-500/30 relative overflow-hidden">

              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl" />

              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-brand-400" />
                  </div>

                  <div>
                    <h3 className="text-white font-bold mb-1">
                      Unlock Full Menu &
                      Reservations
                    </h3>

                    <p className="text-sm text-slate-400">
                      Login to view detailed menu,
                      place orders, and reserve tables
                    </p>
                  </div>

                </div>

                <Link
                  to="/login"
                  className="btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                  <LogIn className="w-4 h-4" />
                  Login Now
                </Link>

              </div>

            </div>

          </div>
        )}

        {/* MENU OVERVIEW */}
        <div className="mb-16 animate-fade-in">

          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />

            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

            <div className="relative">

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center heading-elegant">
                What We Serve
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="glass-subtle p-6 rounded-2xl text-center hover:bg-white/[0.06] transition-all">

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 mx-auto mb-3 flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-white font-bold mb-1">
                    Main Course
                  </h3>

                  <p className="text-xs text-slate-400">
                    Hearty & satisfying meals
                  </p>

                </div>

                <div className="glass-subtle p-6 rounded-2xl text-center hover:bg-white/[0.06] transition-all">

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 mx-auto mb-3 flex items-center justify-center">
                    <Pizza className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-white font-bold mb-1">
                    Appetizers
                  </h3>

                  <p className="text-xs text-slate-400">
                    Perfect starters to begin
                  </p>

                </div>
                



                <div className="glass-subtle p-6 rounded-2xl text-center hover:bg-white/[0.06] transition-all">

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 mx-auto mb-3 flex items-center justify-center">
                    <Soup className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-white font-bold mb-1">
                    Soups & Salads
                  </h3>

                  <p className="text-xs text-slate-400">
                    Fresh & healthy options
                  </p>

                </div>

                <div className="glass-subtle p-6 rounded-2xl text-center hover:bg-white/[0.06] transition-all">

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 mx-auto mb-3 flex items-center justify-center">
                    <Cake className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-white font-bold mb-1">
                    Desserts
                  </h3>

                  <p className="text-xs text-slate-400">
                    Sweet endings to your meal
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* SEARCH */}
        <div className="max-w-xl mx-auto mb-8 animate-fade-in">

          <div className="relative">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="glass-input pl-12 pr-10"
            />

            {searchQuery && (
              <button
                onClick={() =>
                  setSearchQuery("")
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>

        {/* REFRESH */}
        <div className="flex justify-end mb-6">

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

        </div>

        {/* LAST UPDATED */}
        {lastUpdated && (
          <p className="text-xs text-slate-600 mb-4 text-right">
            Last updated:
            {" "}
            {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() =>
                setActiveCategory(cat)
              }
              className={`px-5 py-2 text-sm font-medium rounded-xl border transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>

          ))}

        </div>

        {/* RESULTS COUNT */}
        {(searchQuery ||
          activeCategory !== "All") && (
          <p className="text-sm text-slate-500 mb-6 text-center">
            Showing {filteredItems.length}
            {" "}
            {filteredItems.length === 1
              ? "dish"
              : "dishes"}

            {activeCategory !== "All" &&
              ` in ${activeCategory}`}

            {searchQuery &&
              ` matching "${searchQuery}"`}
          </p>
        )}

        {/* MENU LIST */}
        <MenuList
          items={filteredItems}
          status={status}
          limit={isAuthenticated ? null : 6}
        />

        {/* LOGIN CTA */}
        {!isAuthenticated &&
          filteredItems.length > 6 && (

          <div className="text-center mt-8">

            <p className="text-sm text-slate-500 mb-4">
              Showing 6 of{" "}
              {filteredItems.length} dishes
            </p>

            <Link
              to="/login"
              className="btn-secondary inline-flex items-center gap-2"
            >
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