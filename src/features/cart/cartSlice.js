import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],    // { id, itemName, price, quantity, category }
    isOpen: false,
    isPaymentModalOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    openPaymentModal: (state) => {
      state.isPaymentModalOpen = true;
    },
    closePaymentModal: (state) => {
      state.isPaymentModalOpen = false;
    },
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectIsCartOpen = (state) => state.cart.isOpen;
export const selectIsPaymentModalOpen = (state) => state.cart.isPaymentModalOpen;

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart, openPaymentModal, closePaymentModal } = cartSlice.actions;
export default cartSlice.reducer;
