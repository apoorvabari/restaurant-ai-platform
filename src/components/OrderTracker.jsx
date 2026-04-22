import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, deleteOrder } from "../features/orders/orderSlice";
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, UtensilsCrossed, AlertCircle, Trash2, PartyPopper } from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";

const statusConfig = {
  PLACED: { color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Clock, label: "Placed", step: 0 },
  CONFIRMED: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: CheckCircle, label: "Confirmed", step: 1 },
  PREPARING: { color: "text-brand-400 bg-brand-500/10 border-brand-500/20", icon: UtensilsCrossed, label: "Preparing", step: 2 },
  READY: { color: "text-green-400 bg-green-500/10 border-green-500/20", icon: Package, label: "Ready", step: 3 },
  DELIVERED: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: Truck, label: "Delivered", step: 4 },
  CANCELLED: { color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertCircle, label: "Cancelled", step: -1 },
};

const steps = ["Placed", "Confirmed", "Preparing", "Ready", "Delivered"];

const StatusTimeline = ({ currentStatus }) => {
  const conf = statusConfig[currentStatus] || statusConfig.PLACED;
  const activeStep = conf.step;

  if (activeStep === -1) return null; // cancelled

  return (
    <div className="flex items-center gap-1 mt-4">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                i <= activeStep
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                  : "bg-white/5 border border-white/10 text-slate-600"
              } ${i === activeStep ? "animate-pulse-glow ring-2 ring-brand-500/30" : ""}`}
            >
              {i < activeStep ? "✓" : i + 1}
            </div>
            <span className={`text-[10px] mt-1.5 font-medium ${i <= activeStep ? "text-brand-400" : "text-slate-600"}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 rounded-full mb-5 ${i < activeStep ? "bg-brand-500" : "bg-white/5"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const OrderTracker = ({ isAdmin = false, onUpdateStatus = null }) => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.orders);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleDelete = (orderId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId));
    }
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <SkeletonLoader type="row" count={3} />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="glass-card p-12 text-center">
        <Clock className="w-12 h-12 text-brand-400 mx-auto mb-6" />
        <blockquote className="text-xl md:text-2xl font-medium text-white mb-4 heading-elegant">
          "Food is not just eating energy. It's an experience."
        </blockquote>
        <cite className="text-slate-400">— Ferran Adrià</cite>
        <p className="text-sm text-slate-500 mt-6">Unable to load orders at the moment. Please try again later.</p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <Package className="w-7 h-7 text-slate-600" />
        </div>
        <p className="text-lg font-medium text-slate-400">No orders yet</p>
        <p className="text-sm text-slate-600 mt-1">Explore our menu and place your first order!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.map((order) => {
        const conf = statusConfig[order.status] || statusConfig.PLACED;
        const StatusIcon = conf.icon;
        const isExpanded = expandedOrder === order.orderId;

        return (
          <div key={order.orderId} className="glass-card rounded-2xl overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${conf.color}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Order #{order.orderId}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(order.orderTime).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`status-badge border ${conf.color}`}>{conf.label}</span>
                <span className="text-lg font-bold gradient-text">₹{order.totalAmount?.toFixed(2)}</span>
                <button
                  onClick={(e) => handleDelete(order.orderId || order.id, e)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Admin status update buttons */}
                {isAdmin && onUpdateStatus && (
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.orderId || order.id, 'CONFIRMED'); }}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.orderId || order.id, 'PREPARING'); }}
                      className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                    >
                      Preparing
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.orderId || order.id, 'READY'); }}
                      className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                    >
                      Ready
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.orderId || order.id, 'DELIVERED'); }}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                    >
                      Deliver
                    </button>
                  </div>
                )}
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </div>
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-fade-in">
                {/* Delivered Success Message */}
                {order.status === 'DELIVERED' && (
                  <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <PartyPopper className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-emerald-400 font-bold text-sm">Order Delivered!</p>
                      <p className="text-emerald-400/70 text-xs">Your order has been successfully delivered. Enjoy your meal!</p>
                    </div>
                  </div>
                )}
                <StatusTimeline currentStatus={order.status} />

                <div className="mt-5 space-y-2">
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</h5>
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🍛</span>
                        <span className="text-sm text-slate-300">{item.itemName}</span>
                      </div>
                      <div className="text-sm text-slate-400">
                        × {item.quantity} — <span className="text-brand-400">₹{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTracker;
