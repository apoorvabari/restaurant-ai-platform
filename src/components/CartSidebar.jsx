import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectIsCartOpen,
  selectIsPaymentModalOpen,
  closeCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  openPaymentModal,
  closePaymentModal,
} from "../features/cart/cartSlice";
import { placeOrder, fetchOrders } from "../features/orders/orderSlice";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import PaymentModal from "./PaymentModal";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isOpen = useSelector(selectIsCartOpen);
  const isPaymentModalOpen = useSelector(selectIsPaymentModalOpen);
  const { token } = useSelector((state) => state.auth);

  const handlePlaceOrder = () => {
    if (!token) {
      alert("Please login to place an order.");
      return;
    }
    // Close cart and open payment modal
    dispatch(closeCart());
    dispatch(openPaymentModal());
  };

  const handlePaymentSuccess = () => {
    // After successful payment, place the actual order
    const orderData = {
      items: items.map((item) => ({
        menuItemId: item.id,
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: total,
    };
    dispatch(placeOrder(orderData));
    dispatch(clearCart());
    dispatch(closeCart());
    dispatch(fetchOrders()); // Refresh orders after placing order
  };

  return (
    <>
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => dispatch(closePaymentModal())}
        amount={total}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Cart Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in"
            onClick={() => dispatch(closeCart())}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-100/95 backdrop-blur-xl border-l border-white/10 z-[70] flex flex-col animate-slide-in-right shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Your Cart</h2>
              <p className="text-xs text-slate-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">Your cart is empty</p>
              <p className="text-sm text-slate-600 mt-1">Add dishes from our menu to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 flex items-center gap-4"
              >
                {/* Food icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                  🍛
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{item.itemName}</h4>
                  <p className="text-brand-400 text-sm font-medium mt-0.5">₹{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold text-white w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Delete */}
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Total</span>
              <span className="text-2xl font-bold gradient-text">₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Proceed to Payment
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(clearCart())}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
        </>
      )}
    </>
  );
};

export default CartSidebar;
