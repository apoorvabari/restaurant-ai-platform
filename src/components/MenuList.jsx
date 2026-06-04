import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { motion } from "framer-motion";
import AnimatedMenuCard from "./AnimatedMenuCard";
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
    const nonVegKeywords = ['chicken', 'mutton', 'pork', 'fish', 'salmon', 'tuna', 'prawn', 'shrimp', 'lobster', 'crab', 'egg', 'omelette', 'bacon', 'ham', 'sausage', 'turkey', 'duck', 'lamb', 'goat', 'keema', 'tikka', 'wings'];
    return !nonVegKeywords.some(keyword => name.includes(keyword));
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {displayItems.map((item, index) => (
        <motion.div
          key={item.id}
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1, 
            duration: 0.5, 
            ease: [0.4, 0, 0.2, 1] 
          }}
        >
          <AnimatedMenuCard item={item} onAddToCart={(item) => dispatch(addToCart(item))} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MenuList;