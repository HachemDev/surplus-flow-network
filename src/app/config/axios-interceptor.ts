
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from './constants';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = API_URL;

const setupAxiosInterceptors = (onUnauthenticated: () => void) => {
  const onRequestSuccess = (config: InternalAxiosRequestConfig) => {
    // Check both storage locations for token
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  const onResponseSuccess = (response: AxiosResponse) => response;

  const onResponseError = (err: any) => {
    const status = err.status || err.response?.status;
    if (status === 403 || status === 401) {
      console.log('Authentication error detected, clearing session');
      onUnauthenticated();
    }
    return Promise.reject(err);
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
