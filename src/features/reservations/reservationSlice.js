import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

// Book a new reservation
export const createReservation = createAsyncThunk(
  "reservations/create",
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/v1/user/reservations", reservationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch all reservations for the logged-in user
export const fetchReservations = createAsyncThunk(
  "reservations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/v1/user/reservations");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Soft delete a reservation
export const deleteReservation = createAsyncThunk(
  "reservations/delete",
  async (reservationId) => {
    await axiosInstance.delete(`/v1/user/reservations/${reservationId}`);
    return reservationId;
  }
);

const reservationSlice = createSlice({
  name: "reservations",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createReservation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
        state.error = null;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchReservations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.list = state.list.filter(reservation => reservation.id !== action.payload);
      });
  },
});

export default reservationSlice.reducer;
