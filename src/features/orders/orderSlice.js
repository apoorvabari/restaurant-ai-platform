import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

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
      });
  },
});

export default orderSlice.reducer;
