// JHipster Backend Integration Types
// These types match the JDL entity definitions exactly

import {
  User,
  UserProfile,
  Company,
  Product,
  Request,
  Transaction,
  Notification,
  CompanyStats,
  ProductImage,
  Favorite,
  Message,
  UserRole,
  CompanyType,
  ProductCategory,
  ProductCondition,
  ProductStatus,
  RequestType,
  RequestStatus,
  TransactionType,
  TransactionStatus,
  NotificationType
} from './index';

// JHipster User entity (built-in)
export interface JhipsterUser {
  id?: number;
  login: string;
  firstName?: string;
  lastName?: string;
  email: string;
  activated: boolean;
  langKey?: string;
  imageUrl?: string;
  resetDate?: Date;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  authorities?: string[];
}

// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  id_token: string;
}

export interface RegisterRequest {
  login: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  langKey?: string;
}

// Search and pagination types
export interface SearchCriteria {
  page?: number;
  size?: number;
  sort?: string[];
  query?: string;
  category?: ProductCategory;
  status?: ProductStatus | RequestStatus | TransactionStatus;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

// Error response type
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  path: string;
  message: string;
  timestamp: string;
  fieldErrors?: Array<{
    objectName: string;
    field: string;
    message: string;
  }>;
}

// Re-export main entities for JHipster integration
export type {
  User,
  UserProfile,
  Company,
  Product,
  Request,
  Transaction,
  Notification,
  CompanyStats,
  ProductImage,
  Favorite,
  Message,
  UserRole,
  CompanyType,
  ProductCategory,
  ProductCondition,
  ProductStatus,
  RequestType,
  RequestStatus,
  TransactionType,
  TransactionStatus,
  NotificationType
};