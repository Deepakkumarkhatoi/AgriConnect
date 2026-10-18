'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, Translations } from '../i18n/translations';
import { apiFetch, setStoredToken, removeStoredToken, getStoredToken } from '../lib/api';

export type UserRole = 'farmer' | 'buyer' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending_verification' | 'suspended';
  district?: string;
  state?: string;
  phone?: string;
  language?: Language;
  organization?: string;
  jurisdiction?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  organization?: string;
  jurisdiction?: string;
  farmSizeAcres?: number;
  cropsGrown?: string[];
}

export interface DemoCredential {
  name: string;
  email: string;
  pass: string;
  role: UserRole;
  title: string;
  subtitle: string;
  icon: string;
}

export const DEMO_CREDENTIALS: Record<UserRole, DemoCredential> = {
  farmer: {
    role: 'farmer',
    name: 'Ramesh Mohapatra',
    email: 'farmer@agriconnect.com',
    pass: 'Farmer@123',
    title: 'Farmer',
    subtitle: 'Ramesh • Puri, Odisha (3.5 Acres)',
    icon: '🌾',
  },
  buyer: {
    role: 'buyer',
    name: 'Ananya Agro Traders',
    email: 'buyer@agriconnect.com',
    pass: 'Buyer@123',
    title: 'Buyer',
    subtitle: 'Ananya Agro • Wholesale Logistics',
    icon: '🛒',
  },
  officer: {
    role: 'officer',
    name: 'Dr. Debabrata Jena',
    email: 'officer@agriconnect.com',
    pass: 'Officer@123',
    title: 'Officer',
    subtitle: 'Dr. Jena • DAO Puri District',
    icon: '🏛️',
  },
  admin: {
    role: 'admin',
    name: 'Platform Administrator',
    email: 'admin@agriconnect.com',
    pass: 'Admin@123',
    title: 'Admin',
    subtitle: 'Operations & Verification Desk',
    icon: '👑',
  },
};

interface AuthContextType {
  user: User | null;
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  quickLoginAs: (role: UserRole) => Promise<UserRole>;
  logout: () => void;
  isLoading: boolean;
  isInitialized: boolean;
  getDashboardPath: (role?: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getDashboardPathForRole = (role?: UserRole): string => {
  switch (role) {
    case 'farmer':
      return '/farmer';
    case 'buyer':
      return '/buyer';
    case 'officer':
      return '/officer';
    case 'admin':
      return '/admin';
    default:
      return '/login';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 1. Language preference
    const savedLang = localStorage.getItem('agriconnect_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'or' || savedLang === 'hi')) {
      setLanguageState(savedLang);
    }

    // 2. Saved user & token session from local storage
    const savedUser = localStorage.getItem('agriconnect_user');
    const token = getStoredToken();

    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.role) {
          setUser(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse cached session:', e);
      }
    } else {
      // Default to null so user can explicitly register or sign in
      setUser(null);
    }

    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agriconnect_lang', lang);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setIsLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; token: string; user: any; error?: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (res && res.success && res.user && res.token) {
        setStoredToken(res.token);
        const mappedUser: User = {
          id: res.user.id || res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          status: res.user.status || 'active',
          district: res.user.district,
          state: res.user.state,
          phone: res.user.phone,
          organization: res.user.organization,
          jurisdiction: res.user.jurisdiction,
        };
        setUser(mappedUser);
        localStorage.setItem('agriconnect_user', JSON.stringify(mappedUser));
        setIsLoading(false);
        return { success: true, role: mappedUser.role };
      }

      setIsLoading(false);
      return { success: false, error: res?.error || 'Invalid credentials. Please verify your email and password.' };
    } catch (err: any) {
      console.warn('Backend login connection error:', err?.message);

      // Offline / fallback verification for demo profiles if network is down
      const matchedKey = (Object.keys(DEMO_CREDENTIALS) as UserRole[]).find(
        (key) => DEMO_CREDENTIALS[key].email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matchedKey && DEMO_CREDENTIALS[matchedKey].pass === password) {
        const demo = DEMO_CREDENTIALS[matchedKey];
        const fallbackUser: User = {
          id: `demo-${matchedKey}-1`,
          name: demo.name,
          email: demo.email,
          role: matchedKey,
          status: 'active',
          district: 'Puri',
          state: 'Odisha',
        };
        setStoredToken(`fallback-jwt-token-${matchedKey}`);
        setUser(fallbackUser);
        localStorage.setItem('agriconnect_user', JSON.stringify(fallbackUser));
        setIsLoading(false);
        return { success: true, role: matchedKey };
      }

      setIsLoading(false);
      return { success: false, error: err?.message || 'Server communication error. Please try again.' };
    }
  };

  const register = async (payload: RegisterPayload): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setIsLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; token: string; user: any; error?: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...payload,
          email: payload.email.trim().toLowerCase(),
        }),
      });

      if (res && res.success && res.user && res.token) {
        setStoredToken(res.token);
        const mappedUser: User = {
          id: res.user.id || res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          status: res.user.status || 'active',
          district: res.user.district,
          state: res.user.state,
          phone: res.user.phone,
          organization: res.user.organization,
          jurisdiction: res.user.jurisdiction,
        };
        setUser(mappedUser);
        localStorage.setItem('agriconnect_user', JSON.stringify(mappedUser));
        setIsLoading(false);
        return { success: true, role: mappedUser.role };
      }

      setIsLoading(false);
      return { success: false, error: res?.error || 'Registration failed. Please check the provided information.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Server registration error. Please try again.' };
    }
  };

  const quickLoginAs = async (role: UserRole): Promise<UserRole> => {
    const cred = DEMO_CREDENTIALS[role];
    await login(cred.email, cred.pass);
    return role;
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
  };

  const t = translations[language] || translations.en;

  return (
    <AuthContext.Provider
      value={{
        user,
        language,
        t,
        setLanguage,
        login,
        register,
        quickLoginAs,
        logout,
        isLoading,
        isInitialized,
        getDashboardPath: getDashboardPathForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
