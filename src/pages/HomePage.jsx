import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MenuList from "../components/MenuList";
import TopRatedSuggestions from "../components/TopRatedSuggestions";
import { fetchFeedback } from "../features/feedback/feedbackSlice";
import { ArrowRight, Utensils, CalendarDays, Star, Users, ChefHat, MessageSquare, Calendar } from "lucide-react";

const stats = [
  { icon: Utensils, label: "Dishes", value: "500+", color: "from-brand-500 to-accent-500" },
  { icon: Users, label: "Happy Customers", value: "50K+", color: "from-pink-500 to-rose-500" },
  { icon: Star, label: "Rating", value: "4.9★", color: "from-accent-400 to-brand-500" },
  { icon: ChefHat, label: "Expert Chefs", value: "25+", color: "from-cyan-500 to-blue-500" },
];

const HomePage = () => {
  const { items, status } = useSelector((state) => state.menu);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { list: feedback, status: feedbackStatus } = useSelector((state) => state.feedback);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeedback());
  }, [dispatch]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      {isAuthenticated && (
        <section className="relative pt-24 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            {/* Floating food emojis */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {["🍕", "🍔", "🍣", "🥘", "🍰", "🍜"].map((emoji, i) => (
                <span
                  key={i}
                  className="absolute text-3xl opacity-10 animate-float"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animationDelay: `${i * 1.2}s`,
                    animationDuration: `${5 + i}s`,
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            <div className="relative animate-fade-in-up">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 heading-elegant">
                TASTE THE
                <br />
                <span className="gradient-text">PERFECTION</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Experience fine dining at its best. Browse our menu, make reservations,
                and track orders — all in one place.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link to="/menu" className="btn-primary flex items-center gap-2 text-lg">
                  Explore Menu
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/reservations" className="btn-secondary flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Reserve a Table
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {stats.map((stat, i) => (
                <div key={i} className="glass-subtle p-5 text-center group hover:bg-white/[0.06] transition-all duration-300">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} mx-auto mb-3 flex items-center justify-center shadow-lg opacity-80`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Top Rated Suggestions */}
            <div className="max-w-7xl mx-auto">
              <TopRatedSuggestions />
            </div>

          </div>
        </section>
      )}

      {/* Featured Dishes - Always visible */}
      <section className="relative px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title heading-elegant">Featured Dishes</h2>
              <p className="section-subtitle">Handpicked by our AI for you</p>
            </div>
            <Link
              to="/menu"
              className="hidden md:flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              View Full Menu
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <MenuList items={items} status={status} limit={6} />

          <div className="text-center mt-10 md:hidden">
            <Link to="/menu" className="btn-secondary inline-flex items-center gap-2">
              View Full Menu
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 heading-elegant">
              Why <span className="gradient-text">Our Food?</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Every dish tells a story of passion, quality, and culinary excellence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-subtle p-8 rounded-3xl hover:bg-white/[0.06] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Utensils className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Farm-to-Table Freshness</h3>
              <p className="text-slate-400 leading-relaxed">
                We source the finest ingredients from local farms, ensuring every bite is bursting with natural flavors and maximum nutrition. Our chefs transform these fresh ingredients into culinary masterpieces daily.
              </p>
            </div>

            <div className="glass-subtle p-8 rounded-3xl hover:bg-white/[0.06] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Master Chefs at Work</h3>
              <p className="text-slate-400 leading-relaxed">
                Our award-winning chefs bring decades of experience from Michelin-starred restaurants around the world. Each dish is crafted with precision, creativity, and a deep understanding of flavor profiles.
              </p>
            </div>

            <div className="glass-subtle p-8 rounded-3xl hover:bg-white/[0.06] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Unforgettable Experience</h3>
              <p className="text-slate-400 leading-relaxed">
                More than just food, we create memories. From the aroma that welcomes you to the final presentation, every detail is designed to make your dining experience truly exceptional and memorable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Customer Feedback */}
      <section className="relative px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 heading-elegant">
              Customer <span className="gradient-text">Reviews</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              See what our customers are saying about their dining experience
            </p>
          </div>

          {feedbackStatus === "loading" ? (
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-400">Loading reviews...</p>
            </div>
          ) : feedback.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-400">No reviews yet</p>
              <p className="text-sm text-slate-600 mt-1">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brand-500/30 scrollbar-track-white/5 hover:scrollbar-thumb-brand-500/50">
              {feedback.slice(0, 6).map((item, index) => (
                <div
                  key={item.id || index}
                  className="glass-subtle p-6 rounded-2xl hover:bg-white/[0.06] transition-all duration-300"
                >
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= item.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-white mb-4 line-clamp-3 text-sm leading-relaxed">
                    {item.comment}
                  </p>

                  {/* Customer Name */}
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{item.customerName}</span>
                  </div>

                  {/* Date */}
                  {item.createdAt && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
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

          {feedback.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/feedbacks" className="btn-secondary inline-flex items-center gap-2">
                View All Reviews
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Signature Dishes Section */}
      <section className="relative px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

            <div className="relative">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 heading-elegant">
                    Our <span className="gradient-text">Signature</span> Creations
                  </h2>
                  <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                    Discover dishes that have earned us recognition from food critics and loyal customers alike. Each signature dish is a masterpiece of flavor, presentation, and innovation.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                      <span className="text-slate-300">Grilled Salmon with Lemon Herb Butter</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                      <span className="text-slate-300">Truffle Infused Risotto with Wild Mushrooms</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                      <span className="text-slate-300">Wagyu Beef Burger with Caramelized Onions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                      <span className="text-slate-300">Chocolate Lava Cake with Vanilla Ice Cream</span>
                    </li>
                  </ul>
                  <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
                    Explore Full Menu
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="relative">
                  <div className="text-9xl mb-4">🍽️</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-subtle p-4 rounded-2xl text-center">
                      <div className="text-4xl mb-2">🥩</div>
                      <p className="text-sm text-slate-400">Premium Meats</p>
                    </div>
                    <div className="glass-subtle p-4 rounded-2xl text-center">
                      <div className="text-4xl mb-2">🥗</div>
                      <p className="text-sm text-slate-400">Fresh Salads</p>
                    </div>
                    <div className="glass-subtle p-4 rounded-2xl text-center">
                      <div className="text-4xl mb-2">🍜</div>
                      <p className="text-sm text-slate-400">Authentic Asian</p>
                    </div>
                    <div className="glass-subtle p-4 rounded-2xl text-center">
                      <div className="text-4xl mb-2">🍰</div>
                      <p className="text-sm text-slate-400">Decadent Desserts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner - Only visible after login */}
      {isAuthenticated && (
        <section className="px-6 pb-10">
          <div className="max-w-5xl mx-auto glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 heading-elegant">
                Ready to <span className="gradient-text">Dine?</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-8">
                Reserve your table now and experience the magic of AI-powered dining.
              </p>
              <Link to="/reservations" className="btn-primary inline-flex items-center gap-2 text-lg">
                <CalendarDays className="w-5 h-5" />
                Book a Table
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;