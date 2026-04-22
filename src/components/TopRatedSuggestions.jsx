import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTopRatedItems } from '../features/menuRatings/menuRatingSlice';
import { Star, TrendingUp, ArrowRight, Leaf, Flame } from 'lucide-react';

const TopRatedSuggestions = () => {
  const dispatch = useDispatch();
  const { topRatedItems, status, error } = useSelector((state) => state.menuRatings);

  // Detect if item is vegetarian based on name
  const isVeg = (itemName) => {
    if (!itemName) return true;
    const name = itemName.toLowerCase();
    const nonVegKeywords = ['chicken', 'mutton', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'prawn', 'shrimp', 'lobster', 'crab', 'egg', 'omelette', 'bacon', 'ham', 'sausage', 'turkey', 'duck', 'lamb', 'goat', 'keema', 'tikka', 'wings'];
    return !nonVegKeywords.some(keyword => name.includes(keyword));
  };

  useEffect(() => {
    dispatch(fetchTopRatedItems());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div className="glass-subtle p-8 rounded-2xl">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400">Loading recommendations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Silently fail - don't show error to user
  }

  if (topRatedItems.length === 0) {
    return null; // Don't show section if no rated items
  }

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Top Rated For You</h2>
          <p className="text-sm text-slate-500">Most loved dishes by our customers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {topRatedItems.map((item) => (
          <Link
            key={item.menuItemId}
            to={`/menu`}
            className="glass-subtle rounded-2xl overflow-hidden group hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            {/* Image */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={item.imageUrl || '/placeholder-food.jpg'}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = '/placeholder-food.jpg';
                }}
              />
              {/* Rating Badge */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white">{item.averageRating}</span>
              </div>
              {/* Veg/Non-veg Badge */}
              {(() => {
                const veg = isVeg(item.name);
                return (
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg flex items-center gap-1 ${
                    veg ? 'bg-green-500/90' : 'bg-red-500/90'
                  }`}>
                    {veg ? <Leaf className="w-3 h-3 text-white" /> : <Flame className="w-3 h-3 text-white" />}
                    <span className="text-xs font-bold text-white">{veg ? 'Veg' : 'Non-Veg'}</span>
                  </div>
                );
              })()}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1 group-hover:text-brand-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-slate-500 mb-2 line-clamp-1">{item.category}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-brand-400 font-bold">₹{item.price}</span>
                <span className="text-xs text-slate-500">{item.totalRatings} ratings</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-6">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          View Full Menu
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default TopRatedSuggestions;
