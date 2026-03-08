import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Load user from token
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, isAuthenticated: false },
  reducers: {
    logout(state) {
      localStorage.removeItem('token');
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const fulfilled = (state, action) => { state.loading = false; state.user = action.payload; state.isAuthenticated = true; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };
    builder
      .addCase(loadUser.pending, pending).addCase(loadUser.fulfilled, fulfilled).addCase(loadUser.rejected, (s) => { s.loading = false; })
      .addCase(login.pending, pending).addCase(login.fulfilled, fulfilled).addCase(login.rejected, rejected)
      .addCase(register.pending, pending).addCase(register.fulfilled, fulfilled).addCase(register.rejected, rejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
