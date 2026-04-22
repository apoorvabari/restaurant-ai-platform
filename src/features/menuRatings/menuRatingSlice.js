import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Async thunks
export const fetchTopRatedItems = createAsyncThunk(
  'menuRatings/fetchTopRated',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/menu-ratings/top-rated`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top rated items');
    }
  }
);

export const submitMenuItemRating = createAsyncThunk(
  'menuRatings/submitRating',
  async (ratingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/menu-ratings`, ratingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit rating');
    }
  }
);

const menuRatingSlice = createSlice({
  name: 'menuRatings',
  initialState: {
    topRatedItems: [],
    status: 'idle',
    error: null,
    submitStatus: 'idle',
    submitError: null,
  },
  reducers: {
    resetSubmitStatus: (state) => {
      state.submitStatus = 'idle';
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch top rated items
      .addCase(fetchTopRatedItems.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTopRatedItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topRatedItems = action.payload;
      })
      .addCase(fetchTopRatedItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Submit rating
      .addCase(submitMenuItemRating.pending, (state) => {
        state.submitStatus = 'loading';
        state.submitError = null;
      })
      .addCase(submitMenuItemRating.fulfilled, (state) => {
        state.submitStatus = 'succeeded';
      })
      .addCase(submitMenuItemRating.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.submitError = action.payload;
      });
  },
});

export const { resetSubmitStatus } = menuRatingSlice.actions;
export default menuRatingSlice.reducer;
