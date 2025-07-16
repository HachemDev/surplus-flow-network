// Simplified Authentication Service - No DTOs, Direct Domain Types

import axios from 'axios';
import { LoginRequest, LoginResponse, User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class AuthService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.axiosInstance.post<LoginResponse>('/api/auth/login', credentials);
    
    if (response.data.token) {
      // Store token based on rememberMe preference
      if (credentials.rememberMe) {
        localStorage.setItem('auth_token', response.data.token);
      } else {
        sessionStorage.setItem('auth_token', response.data.token);
      }
    }
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.axiosInstance.get<User>('/api/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.axiosInstance.post('/api/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.warn('Logout request failed:', error);
    } finally {
      // Clear tokens
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async refreshToken(): Promise<LoginResponse> {
    const response = await this.axiosInstance.post<LoginResponse>('/api/auth/refresh');
    
    if (response.data.token) {
      // Update stored token
      const isRemembered = localStorage.getItem('auth_token');
      if (isRemembered) {
        localStorage.setItem('auth_token', response.data.token);
      } else {
        sessionStorage.setItem('auth_token', response.data.token);
      }
    }
    
    return response.data;
  }

  async register(userData: {
    login: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    const response = await this.axiosInstance.post<User>('/api/auth/register', userData);
    return response.data;
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.axiosInstance.post('/api/auth/reset-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.axiosInstance.post('/api/auth/reset-password/confirm', {
      token,
      newPassword,
    });
  }
}

export default new AuthService();