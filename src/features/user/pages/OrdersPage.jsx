import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../features/orders/orderSlice";
import OrderStatusTracker from "../../../components/OrderStatusTracker";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Sparkles } from "lucide-react";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { status, list } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen pt-8 pb-20 overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-black">
        {/* Stone-textured counterfront */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-stone-700 via-stone-800 to-transparent" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(120, 113, 108, 0.3) 8px, rgba(120, 113, 108, 0.3) 16px), repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(120, 113, 108, 0.2) 8px, rgba(120, 113, 108, 0.2) 16px)`,
          }} />
        </div>

        {/* Smooth dark countertop */}
        <div className="fixed bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black via-stone-950 to-stone-900 pointer-events-none z-0" style={{
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.5)',
        }} />

        {/* Woven rattan pendant lamps with warm golden glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 20}%`,
                top: '0',
              }}
            >
              {/* Cord */}
              <div className="w-0.5 h-32 bg-gradient-to-b from-stone-600 to-stone-700 mx-auto" />
              {/* Woven rattan shade */}
              <div className="w-16 h-10 bg-gradient-to-b from-amber-700/80 to-amber-800/90 rounded-b-full mx-auto" style={{
                boxShadow: '0 0 25px rgba(251, 191, 36, 0.5), inset 0 0 15px rgba(251, 191, 36, 0.3)',
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(139, 69, 19, 0.3) 2px, rgba(139, 69, 19, 0.3) 4px)`,
              }} />
              {/* Warm golden glow */}
              <div className="w-10 h-10 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full mx-auto -mt-2" style={{
                boxShadow: '0 0 50px rgba(251, 191, 36, 0.8), 0 0 100px rgba(251, 191, 36, 0.4)',
              }} />
            </div>
          ))}
        </div>

        {/* Decorative vase with pampas grass */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-0">
          <div className="w-12 h-16 bg-gradient-to-b from-stone-600 to-stone-800 rounded-b-lg" style={{
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
          }} />
          {/* Pampas grass */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-1 h-20 bg-gradient-to-t from-amber-200 to-amber-100 rounded-full" style={{ transform: 'rotate(-10deg)' }} />
            <div className="w-1 h-24 bg-gradient-to-t from-amber-300 to-amber-200 rounded-full" style={{ transform: 'rotate(0deg)' }} />
            <div className="w-1 h-20 bg-gradient-to-t from-amber-200 to-amber-100 rounded-full" style={{ transform: 'rotate(10deg)' }} />
            <div className="w-1 h-18 bg-gradient-to-t from-amber-200 to-amber-100 rounded-full" style={{ transform: 'rotate(-5deg)' }} />
            <div className="w-1 h-22 bg-gradient-to-t from-amber-300 to-amber-200 rounded-full" style={{ transform: 'rotate(5deg)' }} />
          </div>
        </div>

        {/* Shelves with bottles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Shelf 1 */}
          <div className="absolute top-20 left-12 w-32 h-2 bg-stone-700 rounded" />
          <div className="absolute top-8 left-14 w-4 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t" />
          <div className="absolute top-6 left-20 w-3 h-14 bg-gradient-to-b from-green-600 to-green-800 rounded-t" />
          <div className="absolute top-10 left-26 w-5 h-10 bg-gradient-to-b from-blue-500 to-blue-700 rounded-t" />
          
          {/* Shelf 2 */}
          <div className="absolute top-20 right-12 w-32 h-2 bg-stone-700 rounded" />
          <div className="absolute top-8 right-14 w-4 h-12 bg-gradient-to-b from-red-600 to-red-800 rounded-t" />
          <div className="absolute top-6 right-20 w-3 h-14 bg-gradient-to-b from-purple-600 to-purple-800 rounded-t" />
          <div className="absolute top-10 right-26 w-5 h-10 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-t" />

          {/* Glassware */}
          <div className="absolute top-32 left-16 w-6 h-8 bg-gradient-to-b from-white/20 to-white/10 rounded-b" style={{ backdropFilter: 'blur(2px)' }} />
          <div className="absolute top-32 right-16 w-6 h-8 bg-gradient-to-b from-white/20 to-white/10 rounded-b" style={{ backdropFilter: 'blur(2px)' }} />
        </div>

        {/* White bowls on counter */}
        <div className="fixed bottom-4 left-1/4 pointer-events-none z-0">
          <div className="w-8 h-4 bg-gradient-to-b from-white to-stone-200 rounded-b-full" style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }} />
        </div>
        <div className="fixed bottom-4 right-1/4 pointer-events-none z-0">
          <div className="w-8 h-4 bg-gradient-to-b from-white to-stone-200 rounded-b-full" style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }} />
        </div>

        {/* Warm ambient lighting */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant">
              YOUR <span className="gradient-text">ORDERS</span>
            </h1>
          </div>

          {/* Quote for non-authenticated users */}
          <div className="bg-stone-900/80 p-12 text-center animate-fade-in border border-amber-700/50 rounded-3xl shadow-2xl">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-amber-100 mb-4 heading-elegant">
              "One cannot think well, love well, sleep well, if one has not dined well."
            </blockquote>
            <cite className="text-amber-300">— Virginia Woolf</cite>
            <div className="mt-8 pt-8 border-t border-amber-700/50">
              <p className="text-amber-200 mb-4">Sign in to track your delicious journey</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-amber-950 font-semibold px-6 py-3 rounded-xl transition-all"
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
    <div className="relative min-h-screen pt-8 pb-20 overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-black">
      {/* Stone-textured counterfront */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-stone-700 via-stone-800 to-transparent" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(120, 113, 108, 0.3) 8px, rgba(120, 113, 108, 0.3) 16px), repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(120, 113, 108, 0.2) 8px, rgba(120, 113, 108, 0.2) 16px)`,
        }} />
      </div>

      {/* Smooth dark countertop */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black via-stone-950 to-stone-900 pointer-events-none z-0" style={{
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.5)',
      }} />

      {/* Woven rattan pendant lamps with warm golden glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: '0',
            }}
          >
            {/* Cord */}
            <div className="w-0.5 h-32 bg-gradient-to-b from-stone-600 to-stone-700 mx-auto" />
            {/* Woven rattan shade */}
            <div className="w-16 h-10 bg-gradient-to-b from-amber-700/80 to-amber-800/90 rounded-b-full mx-auto" style={{
              boxShadow: '0 0 25px rgba(251, 191, 36, 0.5), inset 0 0 15px rgba(251, 191, 36, 0.3)',
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(139, 69, 19, 0.3) 2px, rgba(139, 69, 19, 0.3) 4px)`,
            }} />
            {/* Warm golden glow */}
            <div className="w-10 h-10 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full mx-auto -mt-2" style={{
              boxShadow: '0 0 50px rgba(251, 191, 36, 0.8), 0 0 100px rgba(251, 191, 36, 0.4)',
            }} />
          </div>
        ))}
      </div>

      {/* Decorative vase with pampas grass */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-0">
        <div className="w-12 h-16 bg-gradient-to-b from-stone-600 to-stone-800 rounded-b-lg" style={{
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
        }} />
        {/* Pampas grass */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1 h-20 bg-gradient-to-t from-amber-200 to-amber-100 rounded-full" style={{ transform: 'rotate(-10deg)' }} />
          <div className="w-1 h-24 bg-gradient-to-t from-amber-300 to-amber-200 rounded-full" style={{ transform: 'rotate(0deg)' }} />
          <div className="w-1 h-20 bg-gradient-to-t from-amber-200 to-amber-100 rounded-full" style={{ transform: 'rotate(10deg)' }} />
          <div className="w-1 h-18 bg-gradient-to-t from-amber-200 to-amber-100 rounded-full" style={{ transform: 'rotate(-5deg)' }} />
          <div className="w-1 h-22 bg-gradient-to-t from-amber-300 to-amber-200 rounded-full" style={{ transform: 'rotate(5deg)' }} />
        </div>
      </div>

      {/* Shelves with bottles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Shelf 1 */}
        <div className="absolute top-20 left-12 w-32 h-2 bg-stone-700 rounded" />
        <div className="absolute top-8 left-14 w-4 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t" />
        <div className="absolute top-6 left-20 w-3 h-14 bg-gradient-to-b from-green-600 to-green-800 rounded-t" />
        <div className="absolute top-10 left-26 w-5 h-10 bg-gradient-to-b from-blue-500 to-blue-700 rounded-t" />
        
        {/* Shelf 2 */}
        <div className="absolute top-20 right-12 w-32 h-2 bg-stone-700 rounded" />
        <div className="absolute top-8 right-14 w-4 h-12 bg-gradient-to-b from-red-600 to-red-800 rounded-t" />
        <div className="absolute top-6 right-20 w-3 h-14 bg-gradient-to-b from-purple-600 to-purple-800 rounded-t" />
        <div className="absolute top-10 right-26 w-5 h-10 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-t" />

        {/* Glassware */}
        <div className="absolute top-32 left-16 w-6 h-8 bg-gradient-to-b from-white/20 to-white/10 rounded-b" style={{ backdropFilter: 'blur(2px)' }} />
        <div className="absolute top-32 right-16 w-6 h-8 bg-gradient-to-b from-white/20 to-white/10 rounded-b" style={{ backdropFilter: 'blur(2px)' }} />
      </div>

      {/* White bowls on counter */}
      <div className="fixed bottom-4 left-1/4 pointer-events-none z-0">
        <div className="w-8 h-4 bg-gradient-to-b from-white to-stone-200 rounded-b-full" style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }} />
      </div>
      <div className="fixed bottom-4 right-1/4 pointer-events-none z-0">
        <div className="w-8 h-4 bg-gradient-to-b from-white to-stone-200 rounded-b-full" style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }} />
      </div>

      {/* Warm ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter heading-elegant text-amber-100">
            YOUR <span className="text-amber-500">ORDERS</span>
          </h1>
          <p className="text-amber-200 text-lg mt-2">
            Track your orders in real-time
          </p>
        </div>

        {/* Orders */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="bg-stone-900/70 backdrop-blur-md rounded-3xl p-8 border border-amber-700/50 shadow-2xl">
            {status === "loading" ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-amber-200">Loading orders...</p>
              </div>
            ) : status === "failed" ? (
              <div className="text-center py-12">
                <div className="text-amber-200">Failed to load orders. Please try again.</div>
              </div>
            ) : (
              <div className="space-y-6">
                {list.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                    <p className="text-lg font-medium text-amber-200">No orders yet</p>
                    <p className="text-sm text-amber-300 mt-1">Place your first order to get started!</p>
                  </div>
                ) : (
                  list.map((order) => (
                    <OrderStatusTracker key={order.orderId || order.id} orderId={order.orderId || order.id} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Browse Menu CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
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
