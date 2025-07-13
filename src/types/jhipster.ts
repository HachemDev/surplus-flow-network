// JHipster Backend Entity Types - Generated from surplus360.jdl

// Enums from JDL
export enum CompanyType {
  BUSINESS = 'BUSINESS',
  ASSOCIATION = 'ASSOCIATION', 
  STARTUP = 'STARTUP',
  NGO = 'NGO',
  COOPERATIVE = 'COOPERATIVE'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY',
  ASSOCIATION = 'ASSOCIATION',
  ENTREPRENEUR = 'ENTREPRENEUR',
  INDIVIDUAL = 'INDIVIDUAL'
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

// JHipster User (built-in entity)
export interface JhipsterUser {
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
  // Additional properties for frontend compatibility
  role?: UserRole;
  avatar?: string;
  companyId?: number;
  isVerified?: boolean;
  createdAt?: string; // Alias for createdDate
}

// Entity interfaces matching JDL exactly
export interface Company {
  id?: number;
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
  verified?: boolean;
  certifications?: string;
  createdAt?: string;
  updatedAt?: string;
  // Relations
  users?: UserProfile[];
  products?: Product[];
  requests?: Request[];
  stats?: CompanyStats[];
}

export interface UserProfile {
  id?: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  avatar?: string;
  isVerified?: boolean;
  role: UserRole;
  createdAt?: string;
  lastLogin?: string;
  // Relations
  user?: JhipsterUser;
  company?: Company;
}

export interface Product {
  id?: number;
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
  images?: string;
  tags?: string;
  weight?: number;
  dimensions?: string;
  pickupOnly?: boolean;
  deliveryAvailable?: boolean;
  deliveryRadius?: number;
  deliveryCost?: number;
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
  favoriteCount?: number;
  // Relations
  owner?: JhipsterUser;
  company?: Company;
  productImages?: ProductImage[];
  transactions?: Transaction[];
  favorites?: Favorite[];
}

export interface Request {
  id?: number;
  type: RequestType;
  title: string;
  description: string;
  category: ProductCategory;
  quantity: number;
  maxPrice?: number;
  urgencyLevel?: number;
  location?: string;
  deliveryRequired?: boolean;
  status: RequestStatus;
  reason?: string;
  validUntil?: string;
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
  // Relations
  requester?: JhipsterUser;
  company?: Company;
  transactions?: Transaction[];
}

export interface Transaction {
  id?: number;
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
  createdAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  // Relations
  product?: Product;
  request?: Request;
  buyer?: JhipsterUser;
  seller?: JhipsterUser;
}

export interface Notification {
  id?: number;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  data?: string;
  actionUrl?: string;
  createdAt?: string;
  readAt?: string;
  // Relations
  user?: JhipsterUser;
}

export interface CompanyStats {
  id?: number;
  totalSurplus?: number;
  totalDonations?: number;
  totalSales?: number;
  co2Saved?: number;
  wasteReduced?: number;
  beneficiariesReached?: number;
  month?: number;
  year?: number;
  createdAt?: string;
  // Relations
  company?: Company;
}

export interface ProductImage {
  id?: number;
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
  createdAt?: string;
  // Relations
  product?: Product;
}

export interface Favorite {
  id?: number;
  createdAt?: string;
  // Relations
  user?: JhipsterUser;
  product?: Product;
}

export interface Message {
  id?: number;
  subject?: string;
  content: string;
  isRead?: boolean;
  createdAt?: string;
  readAt?: string;
  // Relations
  sender?: JhipsterUser;
  recipient?: JhipsterUser;
}

// API Response types
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

// API Request types
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

// Search and Filter types
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

// Helper functions for mapping data
export const getUserRole = (user: JhipsterUser): UserRole => {
  if (user.authorities.includes('ROLE_ADMIN')) return UserRole.ADMIN;
  if (user.authorities.includes('ROLE_COMPANY')) return UserRole.COMPANY;
  if (user.authorities.includes('ROLE_ASSOCIATION')) return UserRole.ASSOCIATION;
  if (user.authorities.includes('ROLE_ENTREPRENEUR')) return UserRole.ENTREPRENEUR;
  return UserRole.INDIVIDUAL;
};

export const mapJhipsterUser = (user: JhipsterUser): JhipsterUser => {
  return {
    ...user,
    role: getUserRole(user),
    isVerified: user.activated,
    createdAt: user.createdDate || '',
  };
};

export const getCompanyStats = (stats?: CompanyStats[]): {
  totalSurplus: number;
  totalDonations: number;
  co2Saved: number;
  wasteReduced: number;
} => {
  const initialValue = { totalSurplus: 0, totalDonations: 0, co2Saved: 0, wasteReduced: 0 };
  
  if (!stats || stats.length === 0) {
    return initialValue;
  }
  
  return stats.reduce((acc, stat) => ({
    totalSurplus: acc.totalSurplus + (stat.totalSurplus || 0),
    totalDonations: acc.totalDonations + (stat.totalDonations || 0),
    co2Saved: acc.co2Saved + (stat.co2Saved || 0),
    wasteReduced: acc.wasteReduced + (stat.wasteReduced || 0),
  }), initialValue);
};