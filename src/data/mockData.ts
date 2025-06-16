
import { 
  Product, 
  Company, 
  Transaction, 
  User,
  ProductCategory, 
  ProductStatus, 
  CompanyType, 
  UserRole, 
  TransactionType, 
  TransactionStatus 
} from '../types/surplus';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'EcoTech Solutions',
    type: CompanyType.BUSINESS,
    industry: 'Technology',
    location: 'Paris, France',
    description: 'Leader in green technology solutions',
    rseScore: 85,
    verified: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Association Solidaire',
    type: CompanyType.ASSOCIATION,
    industry: 'Social',
    location: 'Lyon, France',
    description: 'Helping communities in need',
    rseScore: 92,
    verified: true,
    createdAt: new Date('2023-09-20')
  },
  {
    id: '3',
    name: 'GreenStart Initiative',
    type: CompanyType.STARTUP,
    industry: 'Environment',
    location: 'Marseille, France',
    description: 'Young company focused on sustainability',
    rseScore: 78,
    verified: true,
    createdAt: new Date('2024-03-10')
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Ordinateurs portables Dell reconditionnés',
    description: 'Lot de 15 ordinateurs portables Dell en excellent état, légèrement utilisés. Parfaits pour équiper une association ou startup.',
    category: ProductCategory.ELECTRONICS,
    quantity: 15,
    unit: 'pièces',
    estimatedValue: 12000,
    location: 'Paris, France',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    status: ProductStatus.AVAILABLE,
    companyId: '1',
    company: mockCompanies[0],
    createdAt: new Date('2024-12-10')
  },
  {
    id: '2',
    title: 'Mobilier de bureau - Chaises ergonomiques',
    description: 'Collection de 25 chaises de bureau ergonomiques, légèrement usagées mais fonctionnelles. Idéales pour aménager un espace de travail.',
    category: ProductCategory.FURNITURE,
    quantity: 25,
    unit: 'pièces',
    estimatedValue: 3750,
    location: 'Lyon, France',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
    status: ProductStatus.AVAILABLE,
    companyId: '1',
    company: mockCompanies[0],
    createdAt: new Date('2024-12-08')
  },
  {
    id: '3',
    title: 'Surplus textile - Tee-shirts promotionnels',
    description: 'Stock de 200 tee-shirts de haute qualité avec logos d\'ancienne campagne. Parfaits pour événements associatifs ou distribution solidaire.',
    category: ProductCategory.TEXTILE,
    quantity: 200,
    unit: 'pièces',
    estimatedValue: 2000,
    location: 'Marseille, France',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    status: ProductStatus.RESERVED,
    companyId: '3',
    company: mockCompanies[2],
    createdAt: new Date('2024-12-05')
  },
  {
    id: '4',
    title: 'Équipements de cuisine industrielle',
    description: 'Lot d\'équipements de cuisine professionnelle : mixeurs, fours à micro-ondes, vaisselle. Idéal pour association caritative.',
    category: ProductCategory.OFFICE_EQUIPMENT,
    quantity: 10,
    unit: 'lots',
    estimatedValue: 8500,
    location: 'Nice, France',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
    status: ProductStatus.AVAILABLE,
    companyId: '1',
    company: mockCompanies[0],
    createdAt: new Date('2024-12-01')
  },
  {
    id: '5',
    title: 'Matériaux de construction recyclés',
    description: 'Panneaux de bois, isolants écologiques et matériaux de construction de haute qualité issus de projets récents.',
    category: ProductCategory.CONSTRUCTION_MATERIALS,
    quantity: 500,
    unit: 'kg',
    estimatedValue: 1500,
    location: 'Toulouse, France',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
    status: ProductStatus.AVAILABLE,
    companyId: '3',
    company: mockCompanies[2],
    createdAt: new Date('2024-11-28')
  },
  {
    id: '6',
    title: 'Denrées alimentaires non périssables',
    description: 'Stock de conserves, pâtes, riz et produits d\'épicerie proche de la DLC mais encore parfaitement consommables.',
    category: ProductCategory.FOOD,
    quantity: 100,
    unit: 'kg',
    estimatedValue: 800,
    location: 'Bordeaux, France',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    status: ProductStatus.IN_PROGRESS,
    companyId: '1',
    company: mockCompanies[0],
    expirationDate: new Date('2025-03-15'),
    createdAt: new Date('2024-11-25')
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: TransactionType.DONATION,
    productId: '2',
    product: mockProducts[1],
    sellerId: '1',
    seller: mockCompanies[0],
    buyerId: '2',
    buyer: mockCompanies[1],
    price: 0,
    status: TransactionStatus.COMPLETED,
    notes: 'Don pour équiper le centre communautaire',
    taxCertificateUrl: '/certificates/cert-001.pdf',
    createdAt: new Date('2024-12-01'),
    completedAt: new Date('2024-12-05')
  },
  {
    id: '2',
    type: TransactionType.SALE,
    productId: '1',
    product: mockProducts[0],
    sellerId: '1',
    seller: mockCompanies[0],
    buyerId: '3',
    buyer: mockCompanies[2],
    price: 6000,
    status: TransactionStatus.IN_TRANSIT,
    notes: 'Vente solidaire à 50% du prix marché',
    createdAt: new Date('2024-12-08')
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@surplus360.com',
    firstName: 'Admin',
    lastName: 'System',
    role: UserRole.ADMIN,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'contact@ecotech.com',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: UserRole.COMPANY,
    companyId: '1',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    email: 'contact@association-solidaire.org',
    firstName: 'Pierre',
    lastName: 'Martin',
    role: UserRole.COMPANY,
    companyId: '2',
    createdAt: new Date('2023-09-20')
  }
];
