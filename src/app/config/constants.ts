
export const APP_DATE_FORMAT = 'DD/MM/YY HH:mm';
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';

export const AUTHORITIES = {
  ADMIN: 'ROLE_ADMIN',
  COMPANY: 'ROLE_COMPANY', 
  NGO: 'ROLE_NGO',
  ENTREPRENEUR: 'ROLE_ENTREPRENEUR',
} as const;

export const ITEMS_PER_PAGE = 20;
export const SORT = 'id,asc';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/websocket';

export const LANGUAGES = {
  fr: { name: 'Français', dir: 'ltr' },
  en: { name: 'English', dir: 'ltr' },
  ar: { name: 'العربية', dir: 'rtl' }
} as const;

export const DEFAULT_LANGUAGE = 'fr';

export const PRODUCT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;
