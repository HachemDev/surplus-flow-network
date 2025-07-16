import { 
  Company, 
  Product, 
  Transaction, 
  Notification,
  User,
  UserProfile,
  UserRole,
  CompanyType,
  ProductCategory,
  ProductCondition,
  ProductStatus,
  TransactionType,
  TransactionStatus,
  NotificationType 
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@ecotech.fr',
    firstName: 'Marie',
    lastName: 'Dubois',
    login: 'marie.dubois',
    authorities: ['ROLE_ADMIN', 'ROLE_COMPANY'],
    role: UserRole.ADMIN
  },
  {
    id: '2',
    email: 'contact@solidarite-numerique.org',
    firstName: 'Pierre',
    lastName: 'Martin',
    login: 'pierre.martin',
    authorities: ['ROLE_ASSOCIATION'],
    role: UserRole.ASSOCIATION
  }
];

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'EcoTech Solutions',
    type: CompanyType.BUSINESS,
    industry: 'Technology',
    location: 'Paris, France',
    address: '123 Rue de la Tech, 75001 Paris',
    phone: '+33 1 23 45 67 89',
    email: 'contact@ecotech.fr',
    website: 'https://ecotech-solutions.fr',
    description: 'Leader français en solutions technologiques durables',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
    rseScore: 92,
    verified: true,
    certifications: 'ISO 14001, B-Corp, Label Numérique Responsable',
    totalSurplus: 147,
    totalDonations: 89,
    totalSales: 58,
    co2Saved: 2847,
    wasteReduced: 15673,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Association Solidarité Numérique',
    type: CompanyType.ASSOCIATION,
    industry: 'Social',
    location: 'Lyon, France',
    address: '45 Avenue Solidaire, 69000 Lyon',
    phone: '+33 4 78 90 12 34',
    email: 'contact@solidarite-numerique.org',
    description: 'Association dédiée à la réduction de la fracture numérique',
    logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    rseScore: 88,
    verified: true,
    certifications: 'Agrément Préfectoral, Label IDEAS',
    totalSurplus: 203,
    totalDonations: 203,
    totalSales: 0,
    co2Saved: 1456,
    wasteReduced: 8920,
    createdAt: '2023-06-10T00:00:00Z'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Ordinateurs portables Dell reconditionnés',
    description: 'Lot de 15 ordinateurs portables Dell Latitude 7420 reconditionnés',
    category: ProductCategory.OFFICE_EQUIPMENT,
    condition: ProductCondition.GOOD,
    status: ProductStatus.AVAILABLE,
    quantity: 15,
    unit: 'unités',
    estimatedValue: 4500,
    salePrice: 2250,
    location: 'Paris 15ème',
    images: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    tags: 'ordinateur, laptop, professionnel, reconditionné',
    expirationDate: '2024-12-31',
    pickupInstructions: 'Enlèvement sur site du lundi au vendredi',
    views: 89,
    interests: 12,
    createdAt: '2024-10-15T10:30:00Z',
    updatedAt: '2024-11-20T14:22:00Z'
  },
  {
    id: '2',
    title: 'Textile professionnel - Uniformes neufs',
    description: 'Collection complète d\'uniformes de travail neufs',
    category: ProductCategory.TEXTILE,
    condition: ProductCondition.NEW,
    status: ProductStatus.AVAILABLE,
    quantity: 200,
    unit: 'pièces',
    estimatedValue: 6000,
    location: 'Lyon 3ème',
    images: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    tags: 'textile, uniforme, travail, neuf',
    pickupInstructions: 'Livraison possible dans un rayon de 50km',
    views: 156,
    interests: 8,
    createdAt: '2024-10-20T09:15:00Z',
    updatedAt: '2024-11-18T11:45:00Z'
  }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: TransactionType.DONATION,
    status: TransactionStatus.COMPLETED,
    price: 0,
    quantity: 10,
    message: 'Don d\'ordinateurs pour notre programme de formation',
    documents: 'Certificat fiscal, Bon de livraison',
    createdAt: '2024-11-01T10:00:00Z',
    acceptedAt: '2024-11-02T14:30:00Z',
    completedAt: '2024-11-05T16:00:00Z'
  },
  {
    id: '2',
    type: TransactionType.SALE,
    status: TransactionStatus.IN_TRANSIT,
    price: 1500,
    quantity: 5,
    message: 'Achat d\'équipements pour startup',
    documents: 'Facture, Contrat de vente',
    createdAt: '2024-11-10T11:00:00Z',
    acceptedAt: '2024-11-11T09:15:00Z'
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: NotificationType.SURPLUS_MATCH,
    title: 'Nouveau surplus correspondant',
    message: 'Un nouveau produit correspond à vos critères de recherche',
    data: '{"productId": "1", "productTitle": "Ordinateurs portables Dell"}',
    read: false,
    priority: 'HIGH',
    createdAt: '2024-11-20T10:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    type: NotificationType.TRANSACTION_UPDATE,
    title: 'Transaction mise à jour',
    message: 'Votre transaction a été acceptée',
    data: '{"transactionId": "1"}',
    read: false,
    priority: 'MEDIUM',
    createdAt: '2024-11-19T15:45:00Z'
  }
];

// Helper function to get user's company
export const getUserCompany = (userId: string): Company | undefined => {
  // For demo purposes, map users to companies
  const userCompanyMap: Record<string, string> = {
    '1': '1', // Marie -> EcoTech
    '2': '2'  // Pierre -> Solidarité Numérique
  };
  
  const companyId = userCompanyMap[userId];
  return mockCompanies.find(c => c.id === companyId);
};

// Helper function to get products by company
export const getProductsByCompany = (companyId: string): Product[] => {
  return mockProducts.filter(p => p.company?.id === companyId);
};

// Helper function to get user's transactions
export const getUserTransactions = (userId: string): Transaction[] => {
  return mockTransactions.filter(t => 
    t.buyer?.id === userId || t.seller?.id === userId
  );
};