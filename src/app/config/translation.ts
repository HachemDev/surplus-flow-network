
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  fr: {
    translation: {
      common: {
        save: 'Sauvegarder',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        view: 'Voir',
        search: 'Rechercher',
        loading: 'Chargement...',
        error: 'Une erreur est survenue',
        success: 'Opération réussie',
        confirm: 'Confirmer',
        yes: 'Oui',
        no: 'Non',
      },
      auth: {
        login: 'Connexion',
        logout: 'Déconnexion',
        register: 'Inscription',
        email: 'E-mail',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        firstName: 'Prénom',
        lastName: 'Nom',
        company: 'Entreprise',
        forgotPassword: 'Mot de passe oublié?',
        rememberMe: 'Se souvenir de moi',
        noAccount: 'Pas de compte?',
        hasAccount: 'Déjà un compte?',
      },
      navbar: {
        dashboard: 'Tableau de bord',
        marketplace: 'Marché',
        surplus: 'Mes surplus',
        requests: 'Demandes',
        transactions: 'Transactions',
        profile: 'Profil',
        settings: 'Paramètres',
      },
      product: {
        title: 'Titre',
        description: 'Description',
        category: 'Catégorie',
        quantity: 'Quantité',
        price: 'Prix',
        location: 'Localisation',
        status: 'Statut',
        available: 'Disponible',
        reserved: 'Réservé',
        inProgress: 'En cours',
        completed: 'Terminé',
      },
      transaction: {
        pending: 'En attente',
        accepted: 'Accepté',
        inTransit: 'En transit',
        delivered: 'Livré',
        cancelled: 'Annulé',
      }
    }
  },
  en: {
    translation: {
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        search: 'Search',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Operation successful',
        confirm: 'Confirm',
        yes: 'Yes',
        no: 'No',
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        company: 'Company',
        forgotPassword: 'Forgot password?',
        rememberMe: 'Remember me',
        noAccount: 'No account?',
        hasAccount: 'Already have an account?',
      },
      navbar: {
        dashboard: 'Dashboard',
        marketplace: 'Marketplace',
        surplus: 'My Surplus',
        requests: 'Requests',
        transactions: 'Transactions',
        profile: 'Profile',
        settings: 'Settings',
      },
      product: {
        title: 'Title',
        description: 'Description',
        category: 'Category',
        quantity: 'Quantity',
        price: 'Price',
        location: 'Location',
        status: 'Status',
        available: 'Available',
        reserved: 'Reserved',
        inProgress: 'In Progress',
        completed: 'Completed',
      },
      transaction: {
        pending: 'Pending',
        accepted: 'Accepted',
        inTransit: 'In Transit',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
      }
    }
  },
  ar: {
    translation: {
      common: {
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        edit: 'تعديل',
        view: 'عرض',
        search: 'البحث',
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        success: 'تمت العملية بنجاح',
        confirm: 'تأكيد',
        yes: 'نعم',
        no: 'لا',
      },
      auth: {
        login: 'تسجيل الدخول',
        logout: 'تسجيل الخروج',
        register: 'التسجيل',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        company: 'الشركة',
        forgotPassword: 'نسيت كلمة المرور؟',
        rememberMe: 'تذكرني',
        noAccount: 'ليس لديك حساب؟',
        hasAccount: 'لديك حساب؟',
      },
      navbar: {
        dashboard: 'لوحة التحكم',
        marketplace: 'السوق',
        surplus: 'فائضي',
        requests: 'الطلبات',
        transactions: 'المعاملات',
        profile: 'الملف الشخصي',
        settings: 'الإعدادات',
      },
      product: {
        title: 'العنوان',
        description: 'الوصف',
        category: 'الفئة',
        quantity: 'الكمية',
        price: 'السعر',
        location: 'الموقع',
        status: 'الحالة',
        available: 'متاح',
        reserved: 'محجوز',
        inProgress: 'قيد التنفيذ',
        completed: 'مكتمل',
      },
      transaction: {
        pending: 'في الانتظار',
        accepted: 'مقبول',
        inTransit: 'في الطريق',
        delivered: 'تم التسليم',
        cancelled: 'ملغى',
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

export default i18n;
