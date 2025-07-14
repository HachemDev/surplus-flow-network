import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  id_token: string;
}

export interface UserAccount {
  id: number;
  login: string;
  firstName?: string;
  lastName?: string;
  email: string;
  activated: boolean;
  langKey: string;
  authorities: string[];
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem('id_token');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/authenticate`, credentials);
      const { id_token } = response.data;
      
      if (credentials.rememberMe) {
        localStorage.setItem('id_token', id_token);
      } else {
        sessionStorage.setItem('id_token', id_token);
      }
      
      this.token = id_token;
      return response.data;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async getAccount(): Promise<UserAccount> {
    if (!this.token) {
      throw new Error('No token available');
    }
    
    try {
      const response = await axios.get<UserAccount>(`${API_URL}/account`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch account information');
    }
  }

  logout(): void {
    localStorage.removeItem('id_token');
    sessionStorage.removeItem('id_token');
    this.token = null;
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('id_token') || sessionStorage.getItem('id_token');
    }
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    // This would need to be implemented based on stored user data
    // For now, return false as a placeholder
    return false;
  }

  hasAnyAuthority(authorities: string[]): boolean {
    // This would need to be implemented based on stored user data
    // For now, return false as a placeholder
    return false;
  }
}

export default AuthService.getInstance();