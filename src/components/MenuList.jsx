import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { Plus, Flame, Leaf } from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";

const MenuList = ({ items = [], status, limit }) => {
  const dispatch = useDispatch();

  const displayItems = limit ? items.slice(0, limit) : items;

  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonLoader type="card" count={limit || 6} />
      </div>
    );
  }

  if (displayItems.length === 0 && status === "succeeded") {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🍽️</div>
        <p className="text-xl text-slate-400 font-medium">No dishes found</p>
        <p className="text-sm text-slate-600 mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  const categoryEmojis = {
    STARTER: "🥗",
    "MAIN COURSE": "🍛",
    MAIN_COURSE: "🍛",
    DESSERT: "🍰",
    BEVERAGE: "🍹",
    DRINKS: "🍹",
    APPETIZER: "🍤",
    SOUP: "🍜",
  };

  const getEmoji = (category) => {
    if (!category) return "🍛";
    return categoryEmojis[category.toUpperCase()] || "🍛";
  };

  // Detect if item is vegetarian based on name
  const isVeg = (itemName) => {
    if (!itemName) return true;
    const name = itemName.toLowerCase();
    const nonVegKeywords = ['chicken', 'mutton', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'prawn', 'shrimp', 'lobster', 'crab', 'egg', 'omelette', 'bacon', 'ham', 'sausage', 'turkey', 'duck', 'lamb', 'goat', 'keema', 'tikka', 'wings'];
    return !nonVegKeywords.some(keyword => name.includes(keyword));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayItems.map((item, index) => (
        <div
          key={item.id}
          className="glass-card rounded-2xl overflow-hidden group"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {/* Image / Emoji Header */}
          <div className="h-48 bg-gradient-to-br from-brand-500/10 via-accent-500/5 to-transparent flex items-center justify-center relative overflow-hidden">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.itemName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <span className="text-6xl group-hover:scale-110 transition-transform duration-500" style={{ display: item.imageUrl ? 'none' : 'flex' }}>
              {getEmoji(item.category)}
            </span>
            {/* Veg / Non-veg indicator */}
            <div className="absolute top-3 left-3">
              {(() => {
                const veg = isVeg(item.itemName);
                return (
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg ${
                    veg
                      ? "bg-green-500 border-2 border-green-400 text-white"
                      : "bg-red-500 border-2 border-red-400 text-white"
                  }`}>
                    {veg ? <Leaf className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                    {veg ? 'Veg' : 'Non-Veg'}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                {item.itemName}
              </h3>
              <span className="text-brand-400 font-bold text-lg ml-2 flex-shrink-0">
                ₹{item.price}
              </span>
            </div>

            {item.description && (
              <p className="text-slate-500 text-sm line-clamp-2 mb-3 leading-relaxed">
                {item.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 font-medium">
                {item.category}
              </span>
              <button
                onClick={() => dispatch(addToCart(item))}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-400 text-sm font-semibold hover:bg-brand-500 hover:text-white hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-300 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuList;