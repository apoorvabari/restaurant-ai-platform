import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";
import { connectWebSocket } from "../../api/websocketService";

// Place a new order
export const placeOrder = createAsyncThunk("orders/place", async (orderData) => {
  const response = await axiosInstance.post("/v1/user/orders", orderData);
  return response.data;
});

// Fetch all orders for the logged-in user
export const fetchOrders = createAsyncThunk("orders/fetchAll", async () => {
  const response = await axiosInstance.get("/v1/user/orders");
  return response.data;
});

// Soft delete an order
export const deleteOrder = createAsyncThunk("orders/delete", async (orderId) => {
  await axiosInstance.delete(`/v1/user/orders/${orderId}`);
  return orderId;
});

// Real-time order status update
export const updateOrderStatusRealTime = createAsyncThunk("orders/updateStatus", async (orderData) => {
  // This will be called by WebSocket when status changes
  return orderData;
});

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.list = state.list.filter(order => order.id !== action.payload);
      })
      .addCase(updateOrderStatusRealTime.fulfilled, (state, action) => {
        const index = state.list.findIndex(order => order.orderId === action.payload.orderId);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;
