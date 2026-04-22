import React, { useState } from "react";
import { CreditCard, Lock, CheckCircle, AlertCircle, X } from "lucide-react";

const PaymentModal = ({ isOpen, onClose, amount, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  if (!isOpen) return null;

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Auto-close after success and notify parent
      setTimeout(() => {
        onPaymentSuccess();
        handleClose();
      }, 2000);
    }, 2000);
  };

  const handleClose = () => {
    if (!isProcessing) {
      setIsSuccess(false);
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setCardName("");
      onClose();
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[90] p-4">
        <div className="bg-surface-100/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Payment</h2>
                <p className="text-xs text-slate-500">Secure demo payment</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
                <p className="text-slate-400">Your order has been placed successfully.</p>
              </div>
            ) : (
              <>
                {/* Amount Display */}
                <div className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 rounded-xl p-4 mb-6 border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold gradient-text">₹{amount.toFixed(2)}</p>
                </div>

                {/* Demo Notice */}
                <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-400 mb-1">Demo Payment</p>
                    <p className="text-xs text-slate-400">This is a demo payment. No actual charges will be made. Enter any card details to proceed.</p>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Lock className="w-3 h-3" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹{amount.toFixed(2)}
                        <CreditCard className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
