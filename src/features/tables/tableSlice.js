import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

// Fetch all tables
export const fetchTables = createAsyncThunk(
  "tables/fetchAll",
  async () => {
    const response = await axiosInstance.get("/v1/user/tables");
    return response.data;
  }
);

// Fetch available tables only
export const fetchAvailableTables = createAsyncThunk(
  "tables/fetchAvailable",
  async () => {
    const response = await axiosInstance.get("/v1/user/tables/available");
    return response.data;
  }
);

const tableSlice = createSlice({
  name: "tables",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAvailableTables.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAvailableTables.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailableTables.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default tableSlice.reducer;
