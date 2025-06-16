
import { 
  Company, 
  Product, 
  Transaction, 
  Logistics, 
  TrackingEvent,
  RSEImpact,
  Notification,
  UserRole,
  CompanyType,
  ProductCategory,
  ProductStatus,
  TransactionType,
  TransactionStatus 
} from '@/types';

// Entreprises réalistes
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
    description: 'Leader français en solutions technologiques durables, spécialisé dans les équipements informatiques reconditionnés.',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
    rseScore: 92,
    verified: true,
    certifications: ['ISO 14001', 'B-Corp', 'Label Numérique Responsable'],
    createdAt: new Date('2024-01-15'),
    stats: {
      totalSurplus: 147,
      totalDonations: 89,
      totalSales: 58,
      co2Saved: 2847,
      wasteReduced: 15673
    }
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
    description: 'Association dédiée à la réduction de la fracture numérique en équipant les familles en difficulté.',
    logo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200',
    rseScore: 0,
    verified: true,
    certifications: ['Agrément Jeunesse et Sport', 'Habilitation Don en confiance'],
    createdAt: new Date('2024-02-01'),
    stats: {
      totalSurplus: 0,
      totalDonations: 0,
      totalSales: 0,
      co2Saved: 0,
      wasteReduced: 0
    }
  },
  {
    id: '3',
    name: 'GreenStart Innovation',
    type: CompanyType.STARTUP,
    industry: 'Green Tech',
    location: 'Toulouse, France',
    address: '12 Rue Innovation, 31000 Toulouse',
    phone: '+33 5 61 23 45 67',
    email: 'hello@greenstart.co',
    website: 'https://greenstart.co',
    description: 'Startup spécialisée dans les innovations environnementales et l\'économie circulaire.',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200',
    rseScore: 78,
    verified: true,
    certifications: ['French Tech', 'Startup Climate'],
    createdAt: new Date('2024-03-01'),
    stats: {
      totalSurplus: 12,
      totalDonations: 3,
      totalSales: 9,
      co2Saved: 234,
      wasteReduced: 1250
    }
  },
  {
    id: '4',
    name: 'Textile Éthique France',
    type: CompanyType.BUSINESS,
    industry: 'Textile',
    location: 'Lille, France',
    address: '89 Boulevard Textile, 59000 Lille',
    phone: '+33 3 20 45 67 89',
    email: 'contact@textile-ethique.fr',
    website: 'https://textile-ethique.fr',
    description: 'Fabricant de vêtements éthiques et durables, leader du textile responsable en France.',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
    rseScore: 88,
    verified: true,
    certifications: ['GOTS', 'Fair Trade', 'Oeko-Tex'],
    createdAt: new Date('2024-01-20'),
    stats: {
      totalSurplus: 234,
      totalDonations: 156,
      totalSales: 78,
      co2Saved: 4567,
      wasteReduced: 23451
    }
  }
];

// Produits avec des scénarios réalistes
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Ordinateurs portables Dell Latitude reconditionnés',
    description: 'Lot de 15 ordinateurs portables Dell Latitude E7470 en excellent état. Remis à neuf par nos techniciens certifiés, avec garantie 6 mois. Parfaits pour équiper une association ou une startup.',
    category: ProductCategory.ELECTRONICS,
    quantity: 15,
    unit: 'pièces',
    estimatedValue: 12000,
    salePrice: 4500,
    location: 'Paris, France',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      'https://images.unsplash.com/photo-1587614295999-6c1c3a7b6c1b?w=500'
    ],
    status: ProductStatus.AVAILABLE,
    companyId: '1',
    company: mockCompanies[0],
    tags: ['reconditionné', 'garantie', 'professionnel'],
    condition: 'GOOD',
    pickupInstructions: 'Récupération possible en nos locaux du lundi au vendredi, 9h-17h. Prévoir véhicule adapté.',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
    views: 156,
    interests: 12
  },
  {
    id: '2',
    title: 'Mobilier de bureau modulaire',
    description: 'Collection complète de mobilier de bureau moderne : 20 bureaux réglables, 25 chaises ergonomiques, 10 armoires de rangement. Suite à rénovation de nos espaces.',
    category: ProductCategory.FURNITURE,
    quantity: 55,
    unit: 'pièces',
    estimatedValue: 8500,
    salePrice: 0,
    location: 'Lyon, France',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500'
    ],
    status: ProductStatus.RESERVED,
    companyId: '1',
    company: mockCompanies[0],
    tags: ['don', 'ergonomique', 'moderne'],
    condition: 'GOOD',
    expirationDate: new Date('2025-01-15'),
    pickupInstructions: 'Récupération sur 2 jours, démontage à prévoir. Équipe de 3 personnes minimum.',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-12'),
    views: 89,
    interests: 8
  },
  {
    id: '3',
    title: 'Stocks textile fins de série - Collection Automne',
    description: 'Fin de collection automne 2024 : 500 pièces variées (vestes, pulls, pantalons) en tailles S à XL. Matières premières de qualité, parfait pour associations caritatives.',
    category: ProductCategory.TEXTILE,
    quantity: 500,
    unit: 'pièces',
    estimatedValue: 15000,
    salePrice: 2500,
    location: 'Lille, France',
    images: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500'
    ],
    status: ProductStatus.AVAILABLE,
    companyId: '4',
    company: mockCompanies[3],
    tags: ['textile', 'qualité', 'collection'],
    condition: 'NEW',
    expirationDate: new Date('2025-02-01'),
    pickupInstructions: 'Stocks conditionnés sur palettes. Accès poids lourds disponible.',
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-08'),
    views: 234,
    interests: 19
  },
  {
    id: '4',
    title: 'Équipements cuisine professionnelle',
    description: 'Suite à fermeture restaurant : four professionnel, friteuse, plan de travail inox, lave-vaisselle professionnel. Matériel en parfait état de fonctionnement.',
    category: ProductCategory.OFFICE_EQUIPMENT,
    quantity: 8,
    unit: 'pièces',
    estimatedValue: 25000,
    salePrice: 8500,
    location: 'Marseille, France',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'
    ],
    status: ProductStatus.AVAILABLE,
    companyId: '1',
    company: mockCompanies[0],
    tags: ['cuisine', 'professionnel', 'inox'],
    condition: 'LIKE_NEW',
    pickupInstructions: 'Démontage et transport spécialisé requis. Devis transport sur demande.',
    createdAt: new Date('2024-12-07'),
    updatedAt: new Date('2024-12-07'),
    views: 67,
    interests: 5
  },
  {
    id: '5',
    title: 'Matériaux construction écologiques',
    description: 'Surplus chantier éco-construction : isolant chanvre (200m²), bardage bois douglas (150m²), tuiles terre cuite (500 pièces). Matériaux certifiés.',
    category: ProductCategory.CONSTRUCTION_MATERIALS,
    quantity: 850,
    unit: 'unités',
    estimatedValue: 18000,
    salePrice: 6500,
    location: 'Bordeaux, France',
    images: [
      'https://images.unsplash.com/photo-1558618047-fd1ae5c57dd0?w=500'
    ],
    status: ProductStatus.AVAILABLE,
    companyId: '3',
    company: mockCompanies[2],
    tags: ['écologique', 'construction', 'certifié'],
    condition: 'NEW',
    expirationDate: new Date('2025-03-01'),
    pickupInstructions: 'Stockage sous hangar. Enlèvement par camion plateau recommandé.',
    createdAt: new Date('2024-12-09'),
    updatedAt: new Date('2024-12-09'),
    views: 145,
    interests: 11
  },
  {
    id: '6',
    title: 'Denrées alimentaires courte DLC',
    description: 'Produits secs non périssables approchant DLC : conserves, pâtes, riz, légumineuses. Total 800kg, parfait pour banques alimentaires.',
    category: ProductCategory.FOOD,
    quantity: 800,
    unit: 'kg',
    estimatedValue: 3200,
    salePrice: 0,
    location: 'Nantes, France',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
    ],
    status: ProductStatus.AVAILABLE,
    companyId: '1',
    company: mockCompanies[0],
    tags: ['alimentaire', 'don', 'urgence'],
    condition: 'GOOD',
    expirationDate: new Date('2025-01-20'),
    pickupInstructions: 'Récupération urgente souhaitée. Véhicule frigorifique non nécessaire.',
    createdAt: new Date('2024-12-11'),
    updatedAt: new Date('2024-12-11'),
    views: 98,
    interests: 15
  }
];

// Transactions réalistes avec historique
export const mockTransactions: Transaction[] = [
  {
    id: 'T001',
    type: TransactionType.DONATION,
    productId: '2',
    product: mockProducts[1],
    sellerId: '1',
    seller: mockCompanies[0],
    buyerId: '2',
    buyer: mockCompanies[1],
    requesterId: '3',
    price: 0,
    quantity: 55,
    status: TransactionStatus.IN_TRANSIT,
    message: 'Association recherche mobilier pour équiper centre formation jeunes en difficulté.',
    documents: {
      taxCertificate: '/documents/tax-cert-T001.pdf',
      rseCertificate: '/documents/rse-cert-T001.pdf'
    },
    createdAt: new Date('2024-12-08'),
    acceptedAt: new Date('2024-12-09'),
  },
  {
    id: 'T002',
    type: TransactionType.SALE,
    productId: '1',
    product: mockProducts[0],
    sellerId: '1',
    seller: mockCompanies[0],
    buyerId: '3',
    buyer: mockCompanies[2],
    requesterId: '4',
    price: 4500,
    quantity: 15,
    status: TransactionStatus.COMPLETED,
    message: 'Startup recherche équipement informatique pour équipe en croissance.',
    documents: {
      contract: '/documents/contract-T002.pdf',
      rseCertificate: '/documents/rse-cert-T002.pdf'
    },
    createdAt: new Date('2024-12-01'),
    acceptedAt: new Date('2024-12-02'),
    completedAt: new Date('2024-12-10'),
  },
  {
    id: 'T003',
    type: TransactionType.DONATION,
    productId: '6',
    product: mockProducts[5],
    sellerId: '1',
    seller: mockCompanies[0],
    buyerId: '2',
    buyer: mockCompanies[1],
    requesterId: '3',
    price: 0,
    quantity: 800,
    status: TransactionStatus.PENDING,
    message: 'Demande urgente pour banque alimentaire locale.',
    documents: {},
    createdAt: new Date('2024-12-11'),
  }
];

// Logistique avec suivi en temps réel
export const mockLogistics: Logistics[] = [
  {
    id: 'L001',
    transactionId: 'T001',
    carrierName: 'DHL Express',
    trackingNumber: 'DHL123456789FR',
    pickupDate: new Date('2024-12-10'),
    estimatedDelivery: new Date('2024-12-13'),
    status: TransactionStatus.IN_TRANSIT,
    cost: 245,
    pickupAddress: '123 Rue de la Tech, 75001 Paris',
    deliveryAddress: '45 Avenue Solidaire, 69000 Lyon',
    contactPerson: 'Marie Dubois',
    contactPhone: '+33 1 23 45 67 89',
    specialInstructions: 'Livraison entre 9h et 17h. Accès camion sur cour.',
    trackingHistory: [
      {
        id: 'E001',
        timestamp: new Date('2024-12-10T09:00:00'),
        location: 'Paris - Centre de tri',
        status: 'COLLECTED',
        description: 'Colis collecté chez l\'expéditeur',
        coordinates: { lat: 48.8566, lng: 2.3522 }
      },
      {
        id: 'E002',
        timestamp: new Date('2024-12-10T14:30:00'),
        location: 'Paris - Plateforme logistique',
        status: 'SORTED',
        description: 'Colis trié et préparé pour transport',
        coordinates: { lat: 48.8566, lng: 2.3522 }
      },
      {
        id: 'E003',
        timestamp: new Date('2024-12-11T08:15:00'),
        location: 'En transit vers Lyon',
        status: 'IN_TRANSIT',
        description: 'Colis en transit - Arrivée prévue demain',
        coordinates: { lat: 47.0814, lng: 4.2947 }
      }
    ],
    createdAt: new Date('2024-12-10')
  },
  {
    id: 'L002',
    transactionId: 'T002',
    carrierName: 'Chronopost',
    trackingNumber: 'CP987654321FR',
    pickupDate: new Date('2024-12-02'),
    estimatedDelivery: new Date('2024-12-05'),
    actualDelivery: new Date('2024-12-05'),
    status: TransactionStatus.DELIVERED,
    cost: 180,
    pickupAddress: '123 Rue de la Tech, 75001 Paris',
    deliveryAddress: '12 Rue Innovation, 31000 Toulouse',
    contactPerson: 'Sophie Leroy',
    contactPhone: '+33 5 61 23 45 67',
    specialInstructions: 'Livraison au rez-de-chaussée. Prévoir aide déchargement.',
    trackingHistory: [
      {
        id: 'E004',
        timestamp: new Date('2024-12-02T10:00:00'),
        location: 'Paris - Centre de tri',
        status: 'COLLECTED',
        description: 'Colis collecté',
        coordinates: { lat: 48.8566, lng: 2.3522 }
      },
      {
        id: 'E005',
        timestamp: new Date('2024-12-05T11:30:00'),
        location: 'Toulouse - Livré',
        status: 'DELIVERED',
        description: 'Colis livré et réceptionné',
        coordinates: { lat: 43.6047, lng: 1.4442 }
      }
    ],
    createdAt: new Date('2024-12-02')
  }
];

// Impact RSE avec données réalistes
export const mockRSEImpacts: RSEImpact[] = [
  {
    id: 'RSE001',
    companyId: '1',
    period: '2024-Q4',
    co2Saved: 2847,
    wasteReducedKg: 15673,
    donationsMade: 89,
    salesMade: 58,
    totalValueDonated: 145000,
    totalValueSold: 87500,
    associationsHelped: 23,
    entrepreneursHelped: 15,
    certificatesIssued: 89,
    createdAt: new Date('2024-12-01')
  },
  {
    id: 'RSE002',
    companyId: '4',
    period: '2024-Q4',
    co2Saved: 4567,
    wasteReducedKg: 23451,
    donationsMade: 156,
    salesMade: 78,
    totalValueDonated: 234000,
    totalValueSold: 125000,
    associationsHelped: 45,
    entrepreneursHelped: 23,
    certificatesIssued: 156,
    createdAt: new Date('2024-12-01')
  }
];

// Notifications en temps réel
export const mockNotifications: Notification[] = [
  {
    id: 'N001',
    userId: '2',
    type: 'SURPLUS_MATCH',
    title: 'Nouveau surplus correspondant à vos critères',
    message: 'Un lot d\'ordinateurs portables vient d\'être publié et correspond à vos besoins',
    data: { productId: '1', productTitle: 'Ordinateurs portables Dell' },
    read: false,
    priority: 'HIGH',
    createdAt: new Date('2024-12-12T10:30:00')
  },
  {
    id: 'N002',
    userId: '3',
    type: 'TRANSACTION_UPDATE',
    title: 'Votre demande a été acceptée !',
    message: 'EcoTech Solutions a accepté votre demande pour le mobilier de bureau',
    data: { transactionId: 'T001' },
    read: false,
    priority: 'HIGH',
    createdAt: new Date('2024-12-12T09:15:00')
  },
  {
    id: 'N003',
    userId: '4',
    type: 'DELIVERY_UPDATE',
    title: 'Livraison en cours',
    message: 'Vos ordinateurs portables sont en transit, livraison prévue demain',
    data: { trackingNumber: 'CP987654321FR' },
    read: true,
    priority: 'MEDIUM',
    createdAt: new Date('2024-12-11T16:45:00'),
    readAt: new Date('2024-12-11T17:00:00')
  },
  {
    id: 'N004',
    userId: '2',
    type: 'NEW_REQUEST',
    title: 'Nouvelle demande reçue',
    message: 'GreenStart Innovation souhaite acquérir vos matériaux de construction',
    data: { productId: '5', requesterId: '4' },
    read: false,
    priority: 'MEDIUM',
    createdAt: new Date('2024-12-11T14:20:00')
  }
];
