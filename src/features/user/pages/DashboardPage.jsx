import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../../features/orders/orderSlice";
import { fetchReservations } from "../../../features/reservations/reservationSlice";
import OrderTracker from "../../../components/OrderTracker";
import ReservationTracker from "../../../components/ReservationTracker";
import { Package, CalendarCheck, TrendingUp, Award, Clock, LayoutDashboard as DashIcon } from "lucide-react";
import axios from "axios";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: orders } = useSelector((state) => state.orders);
  const { list: reservations } = useSelector((state) => state.reservations);
  const isAdmin = user?.role === 'ADMIN';

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/admin/orders/${orderId}/status`, null, { params: { status } });
      dispatch(fetchOrders());
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(fetchOrders()),
          dispatch(fetchReservations())
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen pt-8 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const statsCards = [
    {
      icon: Package,
      label: "Total Orders",
      value: orders.length,
      color: "from-brand-500 to-accent-500",
      shadow: "shadow-brand-500/20",
    },
    {
      icon: TrendingUp,
      label: "Total Spent",
      value: `₹${totalSpent.toFixed(0)}`,
      color: "from-green-500 to-emerald-500",
      shadow: "shadow-green-500/20",
    },
    {
      icon: CalendarCheck,
      label: "Reservations",
      value: reservations.length,
      color: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20",
    },
    {
      icon: Award,
      label: "Loyalty Points",
      value: orders.length * 50,
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/20",
    },
  ];

  const tabs = [
    { key: "orders", label: "Orders", icon: Package },
    { key: "reservations", label: "Reservations", icon: CalendarCheck },
  ];

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Welcome Header */}
        <div className="mb-10 animate-fade-in-up">
          <p className="text-sm text-brand-400 font-medium flex items-center gap-2">
            <DashIcon className="w-4 h-4" />
            Dashboard
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-1">
            {getGreeting()},{" "}
            <span className="gradient-text">
              {user?.email?.split("@")[0] || "Guest"}
            </span>
          </h1>
          <p className="text-slate-500 mt-2">Here's your activity overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statsCards.map((stat, i) => (
            <div
              key={i}
              className="glass-card p-5 animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg ${stat.shadow}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="glass rounded-3xl p-6 md:p-8 animate-fade-in">
          {activeTab === "orders" ? (
            <OrderTracker isAdmin={isAdmin} onUpdateStatus={isAdmin ? updateOrderStatus : null} />
          ) : (
            <ReservationTracker />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;