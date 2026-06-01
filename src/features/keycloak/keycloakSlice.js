import { createSlice } from '@reduxjs/toolkit';

const keycloakSlice = createSlice({
  name: 'keycloak',
  initialState: {
    isAuthenticated: false,
    token: null,
    user: null,
    initialized: false,
  },
  reducers: {
    setKeycloakState(state, action) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token || null;
      state.user = action.payload.user || null;
      state.initialized = true;
    },
    clearKeycloakState(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
  },
});

export const { setKeycloakState, clearKeycloakState } = keycloakSlice.actions;
export default keycloakSlice.reducer;
