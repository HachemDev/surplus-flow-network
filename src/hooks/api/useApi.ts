import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
  productApi,
  companyApi,
  userApi,
  requestApi,
  transactionApi,
  notificationApi,
  favoriteApi,
  messageApi,
  companyStatsApi
} from '@/services/api';
import {
  Product,
  Company,
  User,
  Request,
  Transaction,
  Notification,
  Favorite,
  Message,
  CompanyStats,
  SearchCriteria,
  PaginatedResponse,
  CreateProductData,
  UpdateProductData,
  CreateCompanyData,
  UpdateCompanyData,
  CreateRequestData,
  UpdateRequestData
} from '@/types';

// Generic hooks for API operations
export function useApiQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

export function useApiMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error: Error, variables, context) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

// Product hooks
export function useProducts(criteria?: SearchCriteria) {
  return useApiQuery(
    ['products', JSON.stringify(criteria)],
    () => productApi.findAll(criteria),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}

export function useSearchProducts(criteria: SearchCriteria) {
  return useApiQuery(
    ['products', 'search', JSON.stringify(criteria)],
    () => productApi.searchProducts(criteria),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
}

export function useMyProducts(criteria?: SearchCriteria) {
  return useApiQuery(
    ['products', 'my-products', JSON.stringify(criteria)],
    () => productApi.getMyProducts(criteria)
  );
}

export function useProduct(id: number) {
  return useApiQuery(
    ['products', id.toString()],
    () => productApi.findById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (product: CreateProductData) => productApi.createProduct(product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: 'Succès',
          description: 'Produit créé avec succès',
        });
      },
    }
  );
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    ({ id, product }: { id: number; product: UpdateProductData }) => 
      productApi.updateProduct(id, product),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['products', id.toString()] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: 'Succès',
          description: 'Produit mis à jour avec succès',
        });
      },
    }
  );
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (id: number) => productApi.deleteEntity(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: 'Succès',
          description: 'Produit supprimé avec succès',
        });
      },
    }
  );
}

export function useUploadProductImages() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    ({ productId, files }: { productId: number; files: File[] }) => 
      productApi.uploadProductImages(productId, files),
    {
      onSuccess: (_, { productId }) => {
        queryClient.invalidateQueries({ queryKey: ['products', productId.toString()] });
        toast({
          title: 'Succès',
          description: 'Images téléchargées avec succès',
        });
      },
    }
  );
}

// Company hooks
export function useCompanies(criteria?: SearchCriteria) {
  return useApiQuery(
    ['companies', JSON.stringify(criteria)],
    () => companyApi.findAll(criteria)
  );
}

export function useSearchCompanies(criteria: SearchCriteria) {
  return useApiQuery(
    ['companies', 'search', JSON.stringify(criteria)],
    () => companyApi.searchCompanies(criteria)
  );
}

export function useMyCompany() {
  return useApiQuery(
    ['companies', 'my-company'],
    () => companyApi.getMyCompany()
  );
}

export function useCompany(id: number) {
  return useApiQuery(
    ['companies', id.toString()],
    () => companyApi.findById(id),
    {
      enabled: !!id,
    }
  );
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (company: CreateCompanyData) => companyApi.createCompany(company),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['companies'] });
        toast({
          title: 'Succès',
          description: 'Entreprise créée avec succès',
        });
      },
    }
  );
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    ({ id, company }: { id: number; company: UpdateCompanyData }) => 
      companyApi.updateCompany(id, company),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['companies', id.toString()] });
        queryClient.invalidateQueries({ queryKey: ['companies'] });
        toast({
          title: 'Succès',
          description: 'Entreprise mise à jour avec succès',
        });
      },
    }
  );
}

// User hooks
export function useMyProfile() {
  return useApiQuery(
    ['users', 'my-profile'],
    () => userApi.getMyProfile()
  );
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (profile: Partial<User>) => userApi.updateMyProfile(profile),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users', 'my-profile'] });
        toast({
          title: 'Succès',
          description: 'Profil mis à jour avec succès',
        });
      },
    }
  );
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (file: File) => userApi.uploadAvatar(file),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users', 'my-profile'] });
        toast({
          title: 'Succès',
          description: 'Avatar mis à jour avec succès',
        });
      },
    }
  );
}

// Request hooks
export function useRequests(criteria?: SearchCriteria) {
  return useApiQuery(
    ['requests', JSON.stringify(criteria)],
    () => requestApi.findAll(criteria)
  );
}

export function useSearchRequests(criteria: SearchCriteria) {
  return useApiQuery(
    ['requests', 'search', JSON.stringify(criteria)],
    () => requestApi.searchRequests(criteria)
  );
}

export function useMyRequests(criteria?: SearchCriteria) {
  return useApiQuery(
    ['requests', 'my-requests', JSON.stringify(criteria)],
    () => requestApi.getMyRequests(criteria)
  );
}

export function useRequest(id: number) {
  return useApiQuery(
    ['requests', id.toString()],
    () => requestApi.findById(id),
    {
      enabled: !!id,
    }
  );
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (request: CreateRequestData) => requestApi.createRequest(request),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        toast({
          title: 'Succès',
          description: 'Demande créée avec succès',
        });
      },
    }
  );
}

export function useUpdateRequest() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    ({ id, request }: { id: number; request: UpdateRequestData }) => 
      requestApi.updateRequest(id, request),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['requests', id.toString()] });
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        toast({
          title: 'Succès',
          description: 'Demande mise à jour avec succès',
        });
      },
    }
  );
}

export function useMatchingProducts(requestId: number) {
  return useApiQuery(
    ['requests', requestId.toString(), 'matches'],
    () => requestApi.findMatchingProducts(requestId),
    {
      enabled: !!requestId,
    }
  );
}

// Transaction hooks
export function useTransactions(criteria?: SearchCriteria) {
  return useApiQuery(
    ['transactions', JSON.stringify(criteria)],
    () => transactionApi.findAll(criteria)
  );
}

export function useMyTransactions(criteria?: SearchCriteria) {
  return useApiQuery(
    ['transactions', 'my-transactions', JSON.stringify(criteria)],
    () => transactionApi.getMyTransactions(criteria)
  );
}

export function useTransaction(id: number) {
  return useApiQuery(
    ['transactions', id.toString()],
    () => transactionApi.findById(id),
    {
      enabled: !!id,
    }
  );
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (transaction: Partial<Transaction>) => transactionApi.createTransaction(transaction),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast({
          title: 'Succès',
          description: 'Transaction créée avec succès',
        });
      },
    }
  );
}

export function useAcceptTransaction() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (id: number) => transactionApi.acceptTransaction(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast({
          title: 'Succès',
          description: 'Transaction acceptée',
        });
      },
    }
  );
}

export function useRejectTransaction() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    ({ id, reason }: { id: number; reason?: string }) =>
      transactionApi.rejectTransaction(id, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast({
          title: 'Transaction rejetée',
          description: 'La transaction a été rejetée',
        });
      },
    }
  );
}

export function useCompleteTransaction() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (id: number) => transactionApi.completeTransaction(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast({
          title: 'Succès',
          description: 'Transaction complétée',
        });
      },
    }
  );
}

export function useCancelTransaction() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    ({ id, reason }: { id: number; reason?: string }) =>
      transactionApi.cancelTransaction(id, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast({
          title: 'Transaction annulée',
          description: 'La transaction a été annulée',
        });
      },
    }
  );
}

export function useRateTransaction() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    ({ id, rating, review }: { id: number; rating: number; review?: string }) =>
      transactionApi.rateTransaction(id, rating, review),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast({
          title: 'Succès',
          description: 'Évaluation enregistrée',
        });
      },
    }
  );
}

// Notification hooks
export function useMyNotifications(criteria?: SearchCriteria) {
  return useApiQuery(
    ['notifications', 'my-notifications', JSON.stringify(criteria)],
    () => notificationApi.getMyNotifications(criteria),
    {
      refetchInterval: 30000, // Poll every 30 seconds
    }
  );
}

export function useUnreadNotificationCount() {
  return useApiQuery(
    ['notifications', 'unread-count'],
    () => notificationApi.getUnreadCount(),
    {
      refetchInterval: 10000, // Poll every 10 seconds
    }
  );
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (id: number) => notificationApi.markAsRead(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    }
  );
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    () => notificationApi.markAllAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        toast({
          title: 'Succès',
          description: 'Toutes les notifications ont été marquées comme lues',
        });
      },
    }
  );
}

// Favorite hooks
export function useMyFavorites(criteria?: SearchCriteria) {
  return useApiQuery(
    ['favorites', 'my-favorites', JSON.stringify(criteria)],
    () => favoriteApi.getMyFavorites(criteria)
  );
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    async ({ productId, isFavorite }: { productId: number; isFavorite: boolean }) => {
      if (isFavorite) {
        await favoriteApi.removeFromFavorites(productId);
      } else {
        await favoriteApi.addToFavorites(productId);
      }
      return !isFavorite;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
    }
  );
}

export function useIsFavorite(productId: number) {
  return useApiQuery(
    ['favorites', 'is-favorite', productId.toString()],
    () => favoriteApi.isFavorite(productId),
    {
      enabled: !!productId,
    }
  );
}

// Message hooks
export function useMyMessages(criteria?: SearchCriteria) {
  return useApiQuery(
    ['messages', 'my-messages', JSON.stringify(criteria)],
    () => messageApi.getMyMessages(criteria)
  );
}

export function useConversation(userId: number, criteria?: SearchCriteria) {
  return useApiQuery(
    ['messages', 'conversation', userId.toString(), JSON.stringify(criteria)],
    () => messageApi.getConversation(userId, criteria),
    {
      enabled: !!userId,
    }
  );
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    ({ recipientId, content, subject }: { recipientId: number; content: string; subject?: string }) =>
      messageApi.sendMessage(recipientId, content, subject),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        toast({
          title: 'Succès',
          description: 'Message envoyé avec succès',
        });
      },
    }
  );
}

// Company Stats hooks
export function useCompanyStats(companyId: number) {
  return useApiQuery(
    ['company-stats', companyId.toString()],
    () => companyApi.getCompanyStats(companyId),
    {
      enabled: !!companyId,
    }
  );
}

export function useCompanyStatsByPeriod(companyId: number, year: number, month?: number) {
  return useApiQuery(
    ['company-stats', 'period', companyId.toString(), year.toString(), month?.toString()],
    () => companyStatsApi.getStatsByPeriod(companyId, year, month),
    {
      enabled: !!companyId && !!year,
    }
  );
}