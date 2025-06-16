
export enum UserRole {
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY',
  ASSOCIATION = 'ASSOCIATION',
  ENTREPRENEUR = 'ENTREPRENEUR'
}

export enum CompanyType {
  BUSINESS = 'BUSINESS',
  ASSOCIATION = 'ASSOCIATION',
  STARTUP = 'STARTUP'
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

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  industry: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  logo?: string;
  rseScore: number;
  verified: boolean;
  certifications: string[];
  createdAt: Date;
  stats: {
    totalSurplus: number;
    totalDonations: number;
    totalSales: number;
    co2Saved: number;
    wasteReduced: number;
  };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  estimatedValue: number;
  salePrice?: number;
  location: string;
  images: string[];
  status: ProductStatus;
  companyId: string;
  company?: Company;
  tags: string[];
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
  expirationDate?: Date;
  pickupInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  interests: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  productId: string;
  product?: Product;
  sellerId: string;
  seller?: Company;
  buyerId: string;
  buyer?: Company;
  requesterId: string;
  requester?: User;
  price: number;
  quantity: number;
  status: TransactionStatus;
  message?: string;
  documents: {
    taxCertificate?: string;
    rseCertificate?: string;
    contract?: string;
  };
  logistics?: Logistics;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
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

export interface Notification {
  id: string;
  userId: string;
  type: 'SURPLUS_MATCH' | 'TRANSACTION_UPDATE' | 'DELIVERY_UPDATE' | 'SYSTEM' | 'NEW_REQUEST';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  readAt?: Date;
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
