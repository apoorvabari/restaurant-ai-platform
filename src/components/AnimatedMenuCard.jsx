import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Leaf, Flame } from 'lucide-react';

const AnimatedMenuCard = ({ item, onAddToCart }) => {
  // Detect if item is vegetarian based on name
  const isVeg = (itemName) => {
    if (!itemName) return true;
    const name = itemName.toLowerCase();
    const nonVegKeywords = ['chicken', 'mutton', 'pork', 'fish', 'salmon', 'tuna', 'prawn', 'shrimp', 'lobster', 'crab', 'egg', 'omelette', 'bacon', 'ham', 'sausage', 'turkey', 'duck', 'lamb', 'goat', 'keema', 'tikka', 'wings'];
    return !nonVegKeywords.some(keyword => name.includes(keyword));
  };

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

  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/')) {
      return `${import.meta.env.BASE_URL}${url.replace(/^\/+/, '')}`;
    }
    return url;
  };

  const resolvedImageUrl = resolveImageUrl(item.imageUrl);

  return (
    <motion.div
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      onClick={() => onAddToCart(item)}
    >
      {/* Image / Emoji Header */}
      <div className="h-48 bg-gradient-to-br from-brand-500/10 via-accent-500/5 to-transparent flex items-center justify-center relative overflow-hidden">
        {resolvedImageUrl ? (
          <motion.img
            src={resolvedImageUrl}
            alt={item.itemName}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <motion.span 
          className="text-6xl" 
          style={{ display: resolvedImageUrl ? 'none' : 'flex' }}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          {getEmoji(item.category)}
        </motion.span>
        
        {/* Veg / Non-veg indicator */}
        <motion.div 
          className="absolute top-3 left-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
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
        </motion.div>

        {/* Discount Badge (if applicable) */}
        {item.discount && (
          <motion.div 
            className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {item.discount}% OFF
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <motion.h3 
            className="text-lg font-bold text-white line-clamp-1 group-hover:text-brand-400 transition-colors"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            {item.itemName}
          </motion.h3>
          <motion.span 
            className="text-brand-400 font-bold text-lg ml-2 flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            ₹{item.price}
          </motion.span>
        </div>

        {item.description && (
          <motion.p 
            className="text-slate-500 text-sm line-clamp-2 mb-3 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {item.description}
          </motion.p>
        )}

        <div className="flex items-center justify-between mt-3">
          <motion.span 
            className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 font-medium"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {item.category}
          </motion.span>
          
          <motion.button
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-400 text-sm font-semibold hover:bg-brand-500 hover:text-white hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedMenuCard;
