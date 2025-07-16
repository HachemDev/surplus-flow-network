// Simplified API Services - No DTOs, Direct Domain Types

import { CrudApiService, BaseApiService } from './base';
import {
  Company,
  User,
  Product,
  Request,
  Transaction,
  Notification,
  CompanyStats,
  Favorite,
  Message,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  SearchCriteria,
  PaginatedResponse,
  CreateProductData,
  UpdateProductData,
  CreateCompanyData,
  UpdateCompanyData,
  CreateRequestData,
  UpdateRequestData
} from '@/types';

// Authentication Service
export class AuthApiService extends BaseApiService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.post<{ token: string; user: User }>('/api/auth/login', credentials);
    return {
      token: response.token,
      user: response.user
    };
  }

  async getCurrentUser(): Promise<User> {
    return this.get('/api/auth/me');
  }

  async register(userInfo: RegisterRequest): Promise<User> {
    return this.post('/api/auth/register', userInfo);
  }

  async logout(): Promise<void> {
    return this.post('/api/auth/logout');
  }

  async refreshToken(): Promise<LoginResponse> {
    const response = await this.post<{ token: string; user: User }>('/api/auth/refresh');
    return {
      token: response.token,
      user: response.user
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    return this.post('/api/auth/reset-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.post('/api/auth/reset-password/confirm', { token, newPassword });
  }
}

// Company API Service
export class CompanyApiService extends CrudApiService<Company> {
  protected basePath = '/api/companies';

  async getMyCompany(): Promise<Company | null> {
    try {
      return await this.get('/api/companies/me');
    } catch {
      return null;
    }
  }

  async createCompany(data: CreateCompanyData): Promise<Company> {
    return this.post('/api/companies', data);
  }

  async updateCompany(id: number, data: UpdateCompanyData): Promise<Company> {
    return this.put(`/api/companies/${id}`, data);
  }

  async getCompanyStats(companyId: number): Promise<CompanyStats> {
    return this.get(`/api/companies/${companyId}/stats`);
  }

  async searchCompanies(criteria: SearchCriteria): Promise<PaginatedResponse<Company>> {
    const params = this.buildSearchParams(criteria);
    return this.get(`/api/companies/search?${params.toString()}`);
  }
}

// User API Service
export class UserApiService extends CrudApiService<User> {
  protected basePath = '/api/users';

  async getMyProfile(): Promise<User | null> {
    try {
      return await this.get('/api/users/me');
    } catch {
      return null;
    }
  }

  async updateMyProfile(profile: Partial<User>): Promise<User> {
    return this.put('/api/users/me', profile);
  }

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.post('/api/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
}

// Product API Service  
export class ProductApiService extends CrudApiService<Product> {
  protected basePath = '/api/products';

  async getMyProducts(criteria?: SearchCriteria): Promise<PaginatedResponse<Product>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/products/me?${params.toString()}`);
  }

  async searchProducts(criteria: SearchCriteria): Promise<PaginatedResponse<Product>> {
    const params = this.buildSearchParams(criteria);
    return this.get(`/api/products/search?${params.toString()}`);
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    return this.post('/api/products', data);
  }

  async updateProduct(id: number, data: UpdateProductData): Promise<Product> {
    return this.put(`/api/products/${id}`, data);
  }

  async incrementViewCount(id: number): Promise<void> {
    return this.post(`/api/products/${id}/view`);
  }

  async uploadProductImages(productId: number, files: File[]): Promise<Product> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    return this.post(`/api/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async deleteProductImage(productId: number, imageUrl: string): Promise<void> {
    return this.delete(`/api/products/${productId}/images`, {
      data: { imageUrl }
    });
  }
}

// Request API Service
export class RequestApiService extends CrudApiService<Request> {
  protected basePath = '/api/requests';

  async getMyRequests(criteria?: SearchCriteria): Promise<PaginatedResponse<Request>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/requests/me?${params.toString()}`);
  }

  async createRequest(data: CreateRequestData): Promise<Request> {
    return this.post('/api/requests', data);
  }

  async updateRequest(id: number, data: UpdateRequestData): Promise<Request> {
    return this.put(`/api/requests/${id}`, data);
  }

  async findMatchingProducts(requestId: number): Promise<Product[]> {
    return this.get(`/api/requests/${requestId}/matches`);
  }

  async searchRequests(criteria: SearchCriteria): Promise<PaginatedResponse<Request>> {
    const params = this.buildSearchParams(criteria);
    return this.get(`/api/requests/search?${params.toString()}`);
  }
}

// Transaction API Service
export class TransactionApiService extends CrudApiService<Transaction> {
  protected basePath = '/api/transactions';

  async getMyTransactions(criteria?: SearchCriteria): Promise<PaginatedResponse<Transaction>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/transactions/me?${params.toString()}`);
  }

  async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    return this.post('/api/transactions', data);
  }

  async acceptTransaction(id: number): Promise<Transaction> {
    return this.post(`/api/transactions/${id}/accept`);
  }

  async rejectTransaction(id: number, reason?: string): Promise<Transaction> {
    return this.post(`/api/transactions/${id}/reject`, { reason });
  }

  async completeTransaction(id: number): Promise<Transaction> {
    return this.post(`/api/transactions/${id}/complete`);
  }

  async cancelTransaction(id: number, reason?: string): Promise<Transaction> {
    return this.post(`/api/transactions/${id}/cancel`, { reason });
  }

  async rateTransaction(id: number, rating: number, review?: string): Promise<Transaction> {
    return this.post(`/api/transactions/${id}/rate`, { rating, review });
  }
}

// Notification API Service
export class NotificationApiService extends CrudApiService<Notification> {
  protected basePath = '/api/notifications';

  async getMyNotifications(criteria?: SearchCriteria): Promise<PaginatedResponse<Notification>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/notifications/me?${params.toString()}`);
  }

  async markAsRead(id: number): Promise<void> {
    return this.post(`/api/notifications/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    return this.post('/api/notifications/read-all');
  }

  async getUnreadCount(): Promise<number> {
    const response = await this.get<{ count: number }>('/api/notifications/unread-count');
    return response.count;
  }

  async deleteNotification(id: number): Promise<void> {
    return this.delete(`/api/notifications/${id}`);
  }
}

// Favorite API Service
export class FavoriteApiService extends CrudApiService<Favorite> {
  protected basePath = '/api/favorites';

  async getMyFavorites(criteria?: SearchCriteria): Promise<PaginatedResponse<Favorite>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/favorites/me?${params.toString()}`);
  }

  async addToFavorites(productId: number): Promise<Favorite> {
    return this.post('/api/favorites', { productId });
  }

  async removeFromFavorites(productId: number): Promise<void> {
    return this.delete(`/api/favorites/product/${productId}`);
  }

  async isFavorite(productId: number): Promise<boolean> {
    try {
      await this.get(`/api/favorites/product/${productId}`);
      return true;
    } catch {
      return false;
    }
  }
}

// Message API Service
export class MessageApiService extends CrudApiService<Message> {
  protected basePath = '/api/messages';

  async getMyMessages(criteria?: SearchCriteria): Promise<PaginatedResponse<Message>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/messages/me?${params.toString()}`);
  }

  async getConversation(userId: number, criteria?: SearchCriteria): Promise<PaginatedResponse<Message>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/messages/conversation/${userId}?${params.toString()}`);
  }

  async sendMessage(recipientId: number, content: string, subject?: string): Promise<Message> {
    return this.post('/api/messages', {
      recipientId,
      content,
      subject
    });
  }

  async markAsRead(messageId: number): Promise<void> {
    return this.post(`/api/messages/${messageId}/read`);
  }

  async deleteMessage(id: number): Promise<void> {
    return this.delete(`/api/messages/${id}`);
  }
}

// Company Stats API Service
export class CompanyStatsApiService extends CrudApiService<CompanyStats> {
  protected basePath = '/api/company-stats';

  async getStatsByCompany(companyId: number): Promise<CompanyStats[]> {
    return this.get(`/api/company-stats/company/${companyId}`);
  }

  async getStatsByPeriod(companyId: number, year: number, month?: number): Promise<CompanyStats> {
    const params = new URLSearchParams({
      companyId: companyId.toString(),
      year: year.toString(),
      ...(month && { month: month.toString() })
    });
    return this.get(`/api/company-stats/period?${params.toString()}`);
  }

  async updateStats(companyId: number, stats: Partial<CompanyStats>): Promise<CompanyStats> {
    return this.put(`/api/company-stats/company/${companyId}`, stats);
  }
}

// Export service instances
export const authApi = new AuthApiService();
export const companyApi = new CompanyApiService();
export const userApi = new UserApiService();
export const productApi = new ProductApiService();
export const requestApi = new RequestApiService();
export const transactionApi = new TransactionApiService();
export const notificationApi = new NotificationApiService();
export const favoriteApi = new FavoriteApiService();
export const messageApi = new MessageApiService();
export const companyStatsApi = new CompanyStatsApiService();

// Export for backwards compatibility
export const userProfileApi = userApi;