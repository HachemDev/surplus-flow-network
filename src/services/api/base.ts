import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { PaginatedResponse, SearchCriteria } from '@/types/jhipster';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class BaseApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('id_token') || sessionStorage.getItem('id_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Clear tokens and redirect to login
          localStorage.removeItem('id_token');
          sessionStorage.removeItem('id_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  protected async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  protected async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  protected async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  protected async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  protected async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  protected buildSearchParams(criteria: SearchCriteria): URLSearchParams {
    const params = new URLSearchParams();
    
    if (criteria.page !== undefined) params.append('page', criteria.page.toString());
    if (criteria.size !== undefined) params.append('size', criteria.size.toString());
    if (criteria.sort) criteria.sort.forEach(s => params.append('sort', s));
    if (criteria.category) params.append('category.equals', criteria.category);
    if (criteria.status) params.append('status.equals', criteria.status);
    if (criteria.location) params.append('location.contains', criteria.location);
    if (criteria.minPrice !== undefined) params.append('salePrice.greaterThanOrEqual', criteria.minPrice.toString());
    if (criteria.maxPrice !== undefined) params.append('salePrice.lessThanOrEqual', criteria.maxPrice.toString());
    if (criteria.searchTerm) params.append('title.contains', criteria.searchTerm);
    
    return params;
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export abstract class CrudApiService<T> extends BaseApiService {
  protected abstract basePath: string;

  async findAll(criteria?: SearchCriteria): Promise<PaginatedResponse<T>> {
    const params = criteria ? this.buildSearchParams(criteria) : new URLSearchParams();
    return this.get(`${this.basePath}?${params.toString()}`);
  }

  async findById(id: number): Promise<T> {
    return this.get(`${this.basePath}/${id}`);
  }

  async create(entity: Partial<T>): Promise<T> {
    return this.post(this.basePath, entity);
  }

  async update(id: number, entity: Partial<T>): Promise<T> {
    return this.put(`${this.basePath}/${id}`, entity);
  }

  async partialUpdate(id: number, entity: Partial<T>): Promise<T> {
    return this.patch(`${this.basePath}/${id}`, entity);
  }

  async deleteEntity(id: number): Promise<void> {
    return this.delete(`${this.basePath}/${id}`);
  }
}