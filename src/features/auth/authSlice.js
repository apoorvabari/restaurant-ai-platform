import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.token || error.response?.data?.message || error.message || 'Invalid credentials';
    return rejectWithValue(errorMessage);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.token || error.response?.data?.message || error.message || 'Registration failed';
    return rejectWithValue(errorMessage);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
    authMode: 'auth0', // 'auth0' or 'local'
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('authMode');
    },
    setAuth0User: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authMode = 'auth0';
    },
    setLocalAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.authMode = 'local';
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('authMode', 'local');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = { email: action.payload.email, role: action.payload.role, userId: action.payload.userId };
        state.isAuthenticated = true;
        state.authMode = 'local';
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('authMode', 'local');
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { email: action.payload.email, role: action.payload.role, userId: action.payload.userId };
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, setAuth0User, setLocalAuth } = authSlice.actions;
export default authSlice.reducer;