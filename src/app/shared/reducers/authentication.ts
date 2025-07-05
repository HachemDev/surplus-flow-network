
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  authorities: string[];
  companyId?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: IUser | null;
  token: string | null;
  error: string | null;
  sessionHasBeenFetched: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  token: localStorage.getItem('authToken') || sessionStorage.getItem('authToken'),
  error: null,
  sessionHasBeenFetched: false,
};

// Check if we should mark session as fetched immediately
if (!initialState.token) {
  // If no token exists, mark session as fetched to prevent infinite loading
  initialState.sessionHasBeenFetched = true;
}

// Async thunks
export const authenticate = createAsyncThunk(
  'auth/authenticate',
  async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    const response = await axios.post('/authenticate', credentials);
    const { token, user } = response.data;
    
    if (credentials.rememberMe) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
    
    return { token, user };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userInfo: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    role: string;
  }) => {
    const response = await axios.post('/register', userInfo);
    return response.data;
  }
);

export const getSession = createAsyncThunk(
  'auth/getSession',
  async () => {
    const response = await axios.get('/account');
    return response.data;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    return null;
  }
);

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.sessionHasBeenFetched = true;
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    markSessionFetched: (state) => {
      state.sessionHasBeenFetched = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Authenticate
      .addCase(authenticate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionHasBeenFetched = true;
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Authentication failed';
        state.sessionHasBeenFetched = true;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Get Session
      .addCase(getSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.sessionHasBeenFetched = true;
      })
      .addCase(getSession.rejected, (state) => {
        state.loading = false;
        state.sessionHasBeenFetched = true;
        // Clear token if session fetch fails
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.sessionHasBeenFetched = true;
      });
  },
});

export const { clearAuth, clearAuthError, markSessionFetched } = authSlice.actions;
export default authSlice.reducer;
