
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
  token: localStorage.getItem('authToken'),
  error: null,
  sessionHasBeenFetched: false,
};

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
    },
    clearAuthError: (state) => {
      state.error = null;
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
      .addCase(getSession.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.sessionHasBeenFetched = true;
      })
      .addCase(getSession.rejected, (state) => {
        state.sessionHasBeenFetched = true;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearAuth, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
