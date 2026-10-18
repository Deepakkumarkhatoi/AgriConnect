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

interface AuthContextType {
  user: User | null;
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  quickLoginAs: (role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo mock profiles for instant testing without mandatory backend running
const DEMO_PROFILES: Record<UserRole, User> = {
  farmer: {
    id: 'demo-farmer-1',
    name: 'Ramesh Mohapatra',
    email: 'farmer@agriconnect.com',
    role: 'farmer',
    status: 'active',
    district: 'Puri',
    state: 'Odisha',
    phone: '+91 98765 43210',
    language: 'en',
  },
  buyer: {
    id: 'demo-buyer-1',
    name: 'Ananya Agro Traders',
    email: 'buyer@agriconnect.com',
    role: 'buyer',
    status: 'active',
    district: 'Bhubaneswar',
    state: 'Odisha',
    organization: 'Ananya Wholesale Logistics Pvt Ltd',
    phone: '+91 98123 45678',
    language: 'en',
  },
  officer: {
    id: 'demo-officer-1',
    name: 'Dr. Debabrata Jena',
    email: 'officer@agriconnect.com',
    role: 'officer',
    status: 'active',
    district: 'Puri',
    state: 'Odisha',
    jurisdiction: 'Puri & Coastal Zone',
    organization: 'Dept. of Agriculture, Govt. of Odisha',
    phone: '+91 94370 11223',
    language: 'en',
  },
  admin: {
    id: 'demo-admin-1',
    name: 'Platform Administrator',
    email: 'admin@agriconnect.com',
    role: 'admin',
    status: 'active',
    district: 'Bhubaneswar',
    state: 'Odisha',
    language: 'en',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_PROFILES.farmer); // Default to Farmer for immediate rich dashboard view
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check saved language
    const savedLang = localStorage.getItem('agriconnect_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'or' || savedLang === 'hi')) {
      setLanguageState(savedLang);
    }

    // Check saved user session
    const savedUser = localStorage.getItem('agriconnect_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // use default
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agriconnect_lang', lang);
  };

  const login = async (email: string, password = 'Password@123'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res && res.success && res.user) {
        setStoredToken(res.token);
        const mappedUser: User = {
          id: res.user.id || res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          status: res.user.status,
          district: res.user.district,
          state: res.user.state,
          phone: res.user.phone,
        };
        setUser(mappedUser);
        localStorage.setItem('agriconnect_user', JSON.stringify(mappedUser));
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.warn('Backend login unavailable, checking matching demo role...');
      // If backend is still starting or cluster not yet connected, match demo user
      const matched = Object.values(DEMO_PROFILES).find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setUser(matched);
        localStorage.setItem('agriconnect_user', JSON.stringify(matched));
        setIsLoading(false);
        return true;
      }
    }

    setIsLoading(false);
    return false;
  };

  const quickLoginAs = async (role: UserRole) => {
    const demo = DEMO_PROFILES[role];
    setUser(demo);
    localStorage.setItem('agriconnect_user', JSON.stringify(demo));
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
        quickLoginAs,
        logout,
        isLoading,
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
