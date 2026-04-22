import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

// Submit feedback
export const submitFeedback = createAsyncThunk(
  "feedback/submit",
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/v1/user/feedback", feedbackData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return rejectWithValue("Please log in to submit feedback");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to submit feedback");
    }
  }
);

// Fetch all feedback
export const fetchFeedback = createAsyncThunk(
  "feedback/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/v1/user/feedback");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch feedback");
    }
  }
);

// Delete feedback
export const deleteFeedback = createAsyncThunk(
  "feedback/delete",
  async (feedbackId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/v1/user/feedback/${feedbackId}`);
      return feedbackId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete feedback");
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit feedback
      .addCase(submitFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.unshift(action.payload);
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch feedback
      .addCase(fetchFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Delete feedback
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.list = state.list.filter((feedback) => feedback.id !== action.payload);
      });
  },
});

export const { clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer;
