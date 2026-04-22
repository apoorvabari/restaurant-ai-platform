import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../features/orders/orderSlice";
import OrderTracker from "../../../components/OrderTracker";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Sparkles } from "lucide-react";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant">
              YOUR <span className="gradient-text">ORDERS</span>
            </h1>
          </div>

          {/* Quote for non-authenticated users */}
          <div className="glass-card p-12 text-center animate-fade-in">
            <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-white mb-4 heading-elegant">
              "One cannot think well, love well, sleep well, if one has not dined well."
            </blockquote>
            <cite className="text-slate-400">— Virginia Woolf</cite>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-slate-400 mb-4">Sign in to track your delicious journey</p>
              <Link
                to="/login"
                className="btn-primary inline-flex items-center gap-2"
              >
                Sign In to View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant">
            YOUR <span className="gradient-text">ORDERS</span>
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            Track your orders in real-time
          </p>
        </div>

        {/* Orders */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <OrderTracker />
        </div>

        {/* Browse Menu CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Browse Menu & Order More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
