// Simplified Type System - No DTOs, Direct Domain Types

// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY',
  ASSOCIATION = 'ASSOCIATION',
  ENTREPRENEUR = 'ENTREPRENEUR',
  INDIVIDUAL = 'INDIVIDUAL'
}

export enum CompanyType {
  BUSINESS = 'BUSINESS',
  ASSOCIATION = 'ASSOCIATION',
  STARTUP = 'STARTUP',
  NGO = 'NGO',
  COOPERATIVE = 'COOPERATIVE'
}

export enum ProductCategory {
  ELECTRONICS = 'ELECTRONICS',
  FURNITURE = 'FURNITURE',
  CLOTHING = 'CLOTHING',
  FOOD = 'FOOD',
  BOOKS = 'BOOKS',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  MEDICAL = 'MEDICAL',
  CONSTRUCTION = 'CONSTRUCTION',
  AUTOMOTIVE = 'AUTOMOTIVE',
  OTHER = 'OTHER'
}

export enum ProductCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR'
}

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  DONATED = 'DONATED',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED',
  DRAFT = 'DRAFT'
}

export enum TransactionType {
  DONATION = 'DONATION',
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  REQUEST = 'REQUEST'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED'
}

export enum RequestType {
  DONATION = 'DONATION',
  PURCHASE = 'PURCHASE'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED'
}

// Core Domain Types
export interface User {
  id: number;
  login: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  activated: boolean;
  companyId?: number;
  company?: Company;
  createdAt: string;
  lastLogin?: string;
  authorities: string[];
}

export interface Company {
  id: number;
  name: string;
  type: CompanyType;
  industry?: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  location?: string;
  logo?: string;
  rseScore?: number;
  verified: boolean;
  certifications?: string;
  createdAt: string;
  updatedAt?: string;
  users?: User[];
  products?: Product[];
  requests?: Request[];
  stats: CompanyStats;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  status: ProductStatus;
  quantity: number;
  originalPrice?: number;
  donationPrice?: number;
  salePrice?: number;
  location?: string;
  availableFrom?: string;
  availableUntil?: string;
  images: string[];
  tags: string[];
  weight?: number;
  dimensions?: string;
  pickupOnly: boolean;
  deliveryAvailable: boolean;
  deliveryRadius?: number;
  deliveryCost?: number;
  createdAt: string;
  updatedAt?: string;
  viewCount: number;
  favoriteCount: number;
  owner?: User;
  company?: Company;
  transactions?: Transaction[];
  isFavorite?: boolean;
}

export interface Request {
  id: number;
  type: RequestType;
  title: string;
  description: string;
  category: ProductCategory;
  quantity: number;
  maxPrice?: number;
  urgencyLevel: number;
  location?: string;
  deliveryRequired: boolean;
  status: RequestStatus;
  reason?: string;
  validUntil?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  requester?: User;
  company?: Company;
  transactions?: Transaction[];
}

export interface Transaction {
  id: number;
  type: TransactionType;
  status: TransactionStatus;
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  deliveryMethod?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  completedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  product?: Product;
  request?: Request;
  buyer?: User;
  seller?: User;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  data?: any;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
  user?: User;
}

export interface CompanyStats {
  id: number;
  totalSurplus: number;
  totalDonations: number;
  totalSales: number;
  co2Saved: number;
  wasteReduced: number;
  beneficiariesReached: number;
  month?: number;
  year?: number;
  createdAt: string;
  company?: Company;
}

export interface Favorite {
  id: number;
  createdAt: string;
  user?: User;
  product?: Product;
}

export interface Message {
  id: number;
  subject?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  sender?: User;
  recipient?: User;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// API Request Types
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  login: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Search and Filter Types
export interface SearchCriteria {
  page?: number;
  size?: number;
  sort?: string[];
  category?: ProductCategory;
  status?: ProductStatus;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}

export interface SearchFilters {
  category?: ProductCategory;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  condition?: ProductCondition[];
  transactionType?: TransactionType[];
  tags?: string[];
  sortBy?: 'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'DISTANCE' | 'RELEVANCE';
}

// Application State
export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  companies: Company[];
  products: Product[];
  transactions: Transaction[];
  notifications: Notification[];
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
}

// Utility Types
export type CreateProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'favoriteCount' | 'owner' | 'company' | 'transactions'>;
export type UpdateProductData = Partial<CreateProductData>;
export type CreateCompanyData = Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'users' | 'products' | 'requests' | 'stats'>;
export type UpdateCompanyData = Partial<CreateCompanyData>;
export type CreateRequestData = Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'requester' | 'company' | 'transactions'>;
export type UpdateRequestData = Partial<CreateRequestData>;

// Helper Functions
export const getUserRole = (user: User): UserRole => {
  if (user.authorities.includes('ROLE_ADMIN')) return UserRole.ADMIN;
  if (user.authorities.includes('ROLE_COMPANY')) return UserRole.COMPANY;
  if (user.authorities.includes('ROLE_ASSOCIATION')) return UserRole.ASSOCIATION;
  if (user.authorities.includes('ROLE_ENTREPRENEUR')) return UserRole.ENTREPRENEUR;
  return UserRole.INDIVIDUAL;
};

export const getCompanyStats = (company: Company): {
  totalSurplus: number;
  totalDonations: number;
  co2Saved: number;
  wasteReduced: number;
} => {
  const stats = company.stats;
  return {
    totalSurplus: stats?.totalSurplus || 0,
    totalDonations: stats?.totalDonations || 0,
    co2Saved: stats?.co2Saved || 0,
    wasteReduced: stats?.wasteReduced || 0,
  };
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};
