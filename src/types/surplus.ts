
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
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  industry: string;
  location: string;
  description: string;
  rseScore: number;
  verified: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  estimatedValue: number;
  location: string;
  imageUrl?: string;
  status: ProductStatus;
  companyId: string;
  company?: Company;
  expirationDate?: Date;
  createdAt: Date;
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
  price: number;
  status: TransactionStatus;
  notes?: string;
  taxCertificateUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface RSEImpact {
  id: string;
  companyId: string;
  co2Saved: number;
  wasteReducedKg: number;
  donationsMade: number;
  salesMade: number;
  totalValueDonated: number;
  totalValueSold: number;
  period: string;
  createdAt: Date;
}

export interface Logistics {
  id: string;
  transactionId: string;
  carrierName: string;
  trackingNumber: string;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  status: TransactionStatus;
  cost: number;
  createdAt: Date;
}
