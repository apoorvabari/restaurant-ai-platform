import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Package, Truck, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { updateOrderStatusRealTime } from '../features/orders/orderSlice';

const statusConfig = {
  PLACED: { 
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20", 
    icon: Clock, 
    label: "Placed", 
    step: 0,
    message: "Order received and being processed"
  },
  CONFIRMED: { 
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20", 
    icon: CheckCircle, 
    label: "Confirmed", 
    step: 1,
    message: "Order confirmed by restaurant"
  },
  PREPARING: { 
    color: "text-brand-400 bg-brand-500/10 border-brand-500/20", 
    icon: UtensilsCrossed, 
    label: "Preparing", 
    step: 2,
    message: "Chef is preparing your delicious meal"
  },
  READY: { 
    color: "text-green-400 bg-green-500/10 border-green-500/20", 
    icon: Package, 
    label: "Ready", 
    step: 3,
    message: "Your order is ready for pickup/delivery"
  },
  DELIVERED: { 
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", 
    icon: Truck, 
    label: "Delivered", 
    step: 4,
    message: "Order successfully delivered! Enjoy your meal!"
  },
  CANCELLED: { 
    color: "text-red-400 bg-red-500/10 border-red-500/20", 
    icon: AlertCircle, 
    label: "Cancelled", 
    step: -1,
    message: "Order has been cancelled"
  }
};

const steps = ["Placed", "Confirmed", "Preparing", "Ready", "Delivered"];

const OrderStatusTracker = ({ orderId }) => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.orders);
  const [isConnected, setIsConnected] = useState(false);
  
  const order = list.find(o => o.orderId === orderId || o.id === orderId);
  const currentStatus = order?.status || 'PLACED';
  const conf = statusConfig[currentStatus] || statusConfig.PLACED;
  const activeStep = conf.step;

  useEffect(() => {
    // WebSocket temporarily disabled - using static status display
    setIsConnected(false);
  }, [orderId, dispatch]);

  const StatusTimeline = () => {
    if (activeStep === -1) return null; // cancelled

    return (
      <div className="flex items-center gap-1 mt-4">
        {steps.map((step, i) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  i <= activeStep
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                    : "bg-white/5 border border-white/10 text-slate-600"
                } ${i === activeStep ? "animate-pulse-glow ring-2 ring-brand-500/30" : ""}`}
              >
                {i < activeStep ? "✓" : i + 1}
              </motion.div>
              <motion.span 
                className={`text-[10px] mt-1.5 font-medium transition-colors ${
                  i <= activeStep ? "text-brand-400" : "text-slate-600"
                }`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                {step}
              </motion.span>
            </div>
            {i < steps.length - 1 && (
              <motion.div 
                className={`flex-1 h-0.5 rounded-full mb-5 transition-all duration-500 ${
                  i < activeStep ? "bg-brand-500" : "bg-white/5"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (!order) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-lg font-medium text-slate-400">Order not found</p>
      </div>
    );
  }

  const StatusIcon = conf.icon;

  return (
    <motion.div
      className="glass-card rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Connection Status */}
      <AnimatePresence>
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <motion.div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${conf.color}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <StatusIcon className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Order #{orderId}</h3>
            <p className="text-sm text-slate-400">
              {order.customerName ? `Customer: ${order.customerName}` : 'Guest'}
            </p>
            <p className="text-sm text-slate-400">
              {new Date(order.orderTime).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <motion.span 
          className={`status-badge border ${conf.color}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {conf.label}
        </motion.span>
      </div>

      {/* Status Message */}
      <motion.div 
        className="p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <motion.p 
          className="text-xl font-semibold text-white mb-2"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {conf.message}
        </motion.p>
      </motion.div>

      {/* Timeline */}
      <div className="px-6 pb-6">
        <StatusTimeline />
      </div>

      {/* Delivery Animation for Delivered Status */}
      <AnimatePresence>
        {currentStatus === 'DELIVERED' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              className="text-8xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 1, repeat: 2 }}
            >
              🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderStatusTracker;
