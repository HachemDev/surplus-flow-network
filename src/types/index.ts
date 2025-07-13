
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

export enum TransactionType {
  DONATION = 'DONATION',
  SALE = 'SALE',
  RECYCLING = 'RECYCLING'
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
  FAIR = 'FAIR',
  POOR = 'POOR'
}

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
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

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED'
}

export interface User {
  id: string;
  login: string;
  email: string;
  firstName?: string;
  lastName?: string;
  activated: boolean;
  createdDate: Date;
  lastModifiedDate?: Date;
  authorities: string[];
  // Frontend compatibility fields
  role?: UserRole;
  companyId?: string;
  avatar?: string;
  isVerified?: boolean;
  createdAt?: Date;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  avatar?: string;
  isVerified: boolean;
  role: UserRole;
  companyId?: string;
  company?: Company;
  user: User;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Company {
  id: string;
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
  createdAt: Date;
  updatedAt?: Date;
  users?: UserProfile[];
  products?: Product[];
  requests?: Request[];
  stats?: CompanyStats[];
}

export interface Product {
  id: string;
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
  imageBlob?: string;
  tags?: string;
  expirationDate?: Date;
  pickupInstructions?: string;
  views?: number;
  interests?: number;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  company?: Company;
  images?: ProductImage[];
  transactions?: Transaction[];
}

export interface Request {
  id: string;
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
  validUntil?: Date;
  tags?: string;
  createdAt: Date;
  updatedAt?: Date;
  requester: User;
  company?: Company;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  productId: string;
  sellerId: string;
  buyerId: string;
  requesterId: string;
  price: number;
  quantity: number;
  message?: string;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  product?: Product;
  buyer?: User;
  seller?: User;
  request?: Request;
}

export interface Logistics {
  id: string;
  transactionId: string;
  carrierName: string;
  trackingNumber: string;
  pickupDate?: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  status: TransactionStatus;
  cost: number;
  pickupAddress: string;
  deliveryAddress: string;
  contactPerson: string;
  contactPhone: string;
  specialInstructions?: string;
  trackingHistory: TrackingEvent[];
  createdAt: Date;
}

export interface TrackingEvent {
  id: string;
  timestamp: Date;
  location: string;
  status: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface RSEImpact {
  id: string;
  companyId: string;
  period: string;
  co2Saved: number;
  wasteReducedKg: number;
  donationsMade: number;
  salesMade: number;
  totalValueDonated: number;
  totalValueSold: number;
  associationsHelped: number;
  entrepreneursHelped: number;
  certificatesIssued: number;
  createdAt: Date;
}

export interface CompanyStats {
  id: string;
  totalSurplus?: number;
  totalDonations?: number;
  totalSales?: number;
  co2Saved?: number;
  wasteReduced?: number;
  beneficiariesReached?: number;
  month?: number;
  year?: number;
  createdAt: Date;
  company?: Company;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
  createdAt: Date;
  product?: Product;
}

export interface Favorite {
  id: string;
  createdAt: Date;
  user: User;
  product: Product;
}

export interface Message {
  id: string;
  subject?: string;
  content: string;
  isRead?: boolean;
  createdAt: Date;
  readAt?: Date;
  sender: User;
  recipient: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: string;
  read?: boolean;
  priority?: string;
  createdAt: Date;
  readAt?: Date;
  user: User;
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
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  companies: Company[];
  products: Product[];
  requests: Request[];
  transactions: Transaction[];
  notifications: Notification[];
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
}
