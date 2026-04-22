import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import menuReducer from '../features/menu/menuSlice';
import orderReducer from '../features/orders/orderSlice';
import reservationReducer from '../features/reservations/reservationSlice';
import cartReducer from '../features/cart/cartSlice';
import tableReducer from '../features/tables/tableSlice';
import feedbackReducer from '../features/feedback/feedbackSlice';
import menuRatingReducer from '../features/menuRatings/menuRatingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    orders: orderReducer,
    reservations: reservationReducer,
    cart: cartReducer,
    tables: tableReducer,
    feedback: feedbackReducer,
    menuRatings: menuRatingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export default store;