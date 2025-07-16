
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
  STARTUP = 'STARTUP'
}

export enum ProductCategory {
  OFFICE_EQUIPMENT = 'OFFICE_EQUIPMENT',
  TEXTILE = 'TEXTILE',
  FOOD = 'FOOD',
  FURNITURE = 'FURNITURE',
  ELECTRONICS = 'ELECTRONICS',
  CONSTRUCTION_MATERIALS = 'CONSTRUCTION_MATERIALS',
  RECYCLED_MATERIALS = 'RECYCLED_MATERIALS',
  OTHER = 'OTHER'
}

export enum ProductCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR'
}

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum TransactionType {
  DONATION = 'DONATION',
  SALE = 'SALE',
  RECYCLING = 'RECYCLING'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum NotificationType {
  SURPLUS_MATCH = 'SURPLUS_MATCH',
  TRANSACTION_UPDATE = 'TRANSACTION_UPDATE',
  DELIVERY_UPDATE = 'DELIVERY_UPDATE',
  SYSTEM = 'SYSTEM',
  NEW_REQUEST = 'NEW_REQUEST'
}

// Core User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  login: string;
  authorities: string[];
  role?: UserRole;
  avatar?: string;
  isVerified?: boolean;
  createdAt?: string;
  companyId?: string;
}

export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  avatar?: string;
  isVerified?: boolean;
  role: UserRole;
  email: string;
  companyId?: string;
  createdAt?: string;
  lastLogin?: string;
  user?: User;
  company?: Company;
}

export interface Company {
  id?: string;
  name: string;
  type: CompanyType;
  industry?: string;
  description?: string;
  website?: string;
  phone?: string;
  email: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  location?: string;
  logo?: string;
  rseScore?: number;
  verified?: boolean;
  certifications?: string;
  totalSurplus?: number;
  totalDonations?: number;
  totalSales?: number;
  co2Saved?: number;
  wasteReduced?: number;
  createdAt?: string;
  updatedAt?: string;
  users?: UserProfile[];
  products?: Product[];
}

export interface Product {
  id?: string;
  title: string;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  status: ProductStatus;
  quantity: number;
  unit: string;
  estimatedValue?: number;
  salePrice?: number;
  location: string;
  images?: string;
  tags?: string;
  expirationDate?: string;
  pickupInstructions?: string;
  views?: number;
  interests?: number;
  createdAt?: string;
  updatedAt?: string;
  owner?: User;
  company?: Company;
  transactions?: Transaction[];
}

export interface Transaction {
  id?: string;
  type: TransactionType;
  status: TransactionStatus;
  price: number;
  quantity: number;
  message?: string;
  documents?: string;
  logistics?: string;
  createdAt?: string;
  acceptedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  product?: Product;
  buyer?: User;
  seller?: User;
}

export interface Notification {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: string;
  read?: boolean;
  priority?: string;
  createdAt?: string;
  readAt?: string;
  user?: User;
}

// API Request/Response types
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  login: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  langKey?: string;
}

export interface LoginResponse {
  id_token: string;
}

export interface SearchCriteria {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Company Stats
export interface CompanyStats {
  totalSurplus: number;
  totalDonations: number;
  totalSales: number;
  co2Saved: number;
  wasteReduced: number;
  monthlyData: {
    month: string;
    surplus: number;
    donations: number;
    sales: number;
  }[];
}

export interface SearchFilters {
  category?: ProductCategory;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  condition?: string[];
  transactionType?: TransactionType[];
  tags?: string[];
  sortBy?: 'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'DISTANCE' | 'RELEVANCE';
}

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

// Helper functions
export const getUserRole = (user: User): UserRole => {
  if (user.authorities.includes('ROLE_ADMIN')) return UserRole.ADMIN;
  if (user.authorities.includes('ROLE_COMPANY')) return UserRole.COMPANY;
  if (user.authorities.includes('ROLE_ASSOCIATION')) return UserRole.ASSOCIATION;
  if (user.authorities.includes('ROLE_ENTREPRENEUR')) return UserRole.ENTREPRENEUR;
  return UserRole.INDIVIDUAL;
};

export const getCompanyStats = (company?: Company): CompanyStats => {
  if (!company) {
    return {
      totalSurplus: 0,
      totalDonations: 0,
      totalSales: 0,
      co2Saved: 0,
      wasteReduced: 0,
      monthlyData: []
    };
  }

  return {
    totalSurplus: company.totalSurplus || 0,
    totalDonations: company.totalDonations || 0,
    totalSales: company.totalSales || 0,
    co2Saved: company.co2Saved || 0,
    wasteReduced: company.wasteReduced || 0,
    monthlyData: []
  };
};
