// API Services for JHipster Backend Integration

import { CrudApiService, BaseApiService } from './base';
import {
  Company,
  UserProfile,
  Product,
  Request,
  Transaction,
  Notification,
  CompanyStats,
  ProductImage,
  Favorite,
  Message,
  JhipsterUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  SearchCriteria,
  PaginatedResponse
} from '@/types/jhipster';

// Authentication Service
export class AuthApiService extends BaseApiService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.post('/api/authenticate', credentials);
  }

  async getAccount(): Promise<JhipsterUser> {
    return this.get('/api/account');
  }

  async register(userInfo: RegisterRequest): Promise<void> {
    return this.post('/api/register', userInfo);
  }

  async activateAccount(key: string): Promise<void> {
    return this.get(`/api/activate?key=${key}`);
  }

  async requestPasswordReset(email: string): Promise<void> {
    return this.post('/api/account/reset-password/init', email);
  }

  async resetPassword(key: string, newPassword: string): Promise<void> {
    return this.post('/api/account/reset-password/finish', { key, newPassword });
  }
}

// Company API Service
export class CompanyApiService extends CrudApiService<Company> {
  protected basePath = '/api/companies';

  async findMyCompany(): Promise<Company | null> {
    try {
      return await this.get('/api/companies/my-company');
    } catch {
      return null;
    }
  }

  async getCompanyStats(companyId: number): Promise<CompanyStats[]> {
    return this.get(`/api/companies/${companyId}/stats`);
  }
}

// User Profile API Service
export class UserProfileApiService extends CrudApiService<UserProfile> {
  protected basePath = '/api/user-profiles';

  async getMyProfile(): Promise<UserProfile | null> {
    try {
      return await this.get('/api/user-profiles/me');
    } catch {
      return null;
    }
  }

  async updateMyProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return this.put('/api/user-profiles/me', profile);
  }
}

// Product API Service  
export class ProductApiService extends CrudApiService<Product> {
  protected basePath = '/api/products';

  async findMyProducts(criteria?: SearchCriteria): Promise<PaginatedResponse<Product>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/products/my-products?${params.toString()}`);
  }

  async searchProducts(criteria: SearchCriteria): Promise<PaginatedResponse<Product>> {
    const params = this.buildSearchParams(criteria);
    return this.get(`/api/products/search?${params.toString()}`);
  }

  async incrementViewCount(id: number): Promise<void> {
    return this.post(`/api/products/${id}/view`);
  }

  async getProductImages(productId: number): Promise<ProductImage[]> {
    return this.get(`/api/products/${productId}/images`);
  }
}

// Request API Service
export class RequestApiService extends CrudApiService<Request> {
  protected basePath = '/api/requests';

  async findMyRequests(criteria?: SearchCriteria): Promise<PaginatedResponse<Request>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/requests/my-requests?${params.toString()}`);
  }

  async findMatchingProducts(requestId: number): Promise<Product[]> {
    return this.get(`/api/requests/${requestId}/matching-products`);
  }
}

// Transaction API Service
export class TransactionApiService extends CrudApiService<Transaction> {
  protected basePath = '/api/transactions';

  async findMyTransactions(criteria?: SearchCriteria): Promise<PaginatedResponse<Transaction>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/transactions/my-transactions?${params.toString()}`);
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
}

// Notification API Service
export class NotificationApiService extends CrudApiService<Notification> {
  protected basePath = '/api/notifications';

  async findMyNotifications(criteria?: SearchCriteria): Promise<PaginatedResponse<Notification>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/notifications/my-notifications?${params.toString()}`);
  }

  async markAsRead(id: number): Promise<void> {
    return this.post(`/api/notifications/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    return this.post('/api/notifications/mark-all-read');
  }

  async getUnreadCount(): Promise<number> {
    return this.get('/api/notifications/unread-count');
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
}

// Product Image API Service
export class ProductImageApiService extends CrudApiService<ProductImage> {
  protected basePath = '/api/product-images';

  async uploadImage(productId: number, file: File): Promise<ProductImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId.toString());
    
    return this.post('/api/product-images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async setPrimaryImage(imageId: number): Promise<void> {
    return this.post(`/api/product-images/${imageId}/set-primary`);
  }
}

// Favorite API Service
export class FavoriteApiService extends CrudApiService<Favorite> {
  protected basePath = '/api/favorites';

  async findMyFavorites(criteria?: SearchCriteria): Promise<PaginatedResponse<Favorite>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/favorites/my-favorites?${params.toString()}`);
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

  async findMyMessages(criteria?: SearchCriteria): Promise<PaginatedResponse<Message>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/messages/my-messages?${params.toString()}`);
  }

  async findConversation(userId: number, criteria?: SearchCriteria): Promise<PaginatedResponse<Message>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`/api/messages/conversation/${userId}?${params.toString()}`);
  }

  async markAsRead(messageId: number): Promise<void> {
    return this.post(`/api/messages/${messageId}/read`);
  }
}

// Export service instances
export const authApi = new AuthApiService();
export const companyApi = new CompanyApiService();
export const userProfileApi = new UserProfileApiService();
export const productApi = new ProductApiService();
export const requestApi = new RequestApiService();
export const transactionApi = new TransactionApiService();
export const notificationApi = new NotificationApiService();
export const companyStatsApi = new CompanyStatsApiService();
export const productImageApi = new ProductImageApiService();
export const favoriteApi = new FavoriteApiService();
export const messageApi = new MessageApiService();