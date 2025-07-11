import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
  productApi,
  companyApi,
  userProfileApi,
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
  UserProfile,
  Request,
  Transaction,
  Notification,
  Favorite,
  Message,
  CompanyStats,
  SearchCriteria,
  PaginatedResponse
} from '@/types/jhipster';

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

export function useMyProducts(criteria?: SearchCriteria) {
  return useApiQuery(
    ['products', 'my-products', JSON.stringify(criteria)],
    () => productApi.findMyProducts(criteria)
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
    (product: Partial<Product>) => productApi.create(product),
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
    ({ id, product }: { id: number; product: Partial<Product> }) => 
      productApi.update(id, product),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['products', id] });
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

// Company hooks
export function useCompanies(criteria?: SearchCriteria) {
  return useApiQuery(
    ['companies', JSON.stringify(criteria)],
    () => companyApi.findAll(criteria)
  );
}

export function useMyCompany() {
  return useApiQuery(
    ['companies', 'my-company'],
    () => companyApi.findMyCompany()
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

// User Profile hooks
export function useMyProfile() {
  return useApiQuery(
    ['user-profile', 'me'],
    () => userProfileApi.getMyProfile()
  );
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (profile: Partial<UserProfile>) => userProfileApi.updateMyProfile(profile),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-profile', 'me'] });
        toast({
          title: 'Succès',
          description: 'Profil mis à jour avec succès',
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

export function useMyRequests(criteria?: SearchCriteria) {
  return useApiQuery(
    ['requests', 'my-requests', JSON.stringify(criteria)],
    () => requestApi.findMyRequests(criteria)
  );
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (request: Partial<Request>) => requestApi.create(request),
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
    () => transactionApi.findMyTransactions(criteria)
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

// Notification hooks
export function useMyNotifications(criteria?: SearchCriteria) {
  return useApiQuery(
    ['notifications', 'my-notifications', JSON.stringify(criteria)],
    () => notificationApi.findMyNotifications(criteria),
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

// Favorite hooks
export function useMyFavorites(criteria?: SearchCriteria) {
  return useApiQuery(
    ['favorites', 'my-favorites', JSON.stringify(criteria)],
    () => favoriteApi.findMyFavorites(criteria)
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

// Company Stats hooks
export function useCompanyStats(companyId: number) {
  return useApiQuery(
    ['company-stats', companyId.toString()],
    () => companyStatsApi.getStatsByCompany(companyId),
    {
      enabled: !!companyId,
    }
  );
}