'use client';

import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../../app/interface/user.interface';
import { USER_KEY } from '@/app/actions/auth';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && window.location.pathname !== '/auth/login' && window.location.pathname !== '/auth/signup') {
      router.push('/auth/login');
    } else if (!loading && user && (window.location.pathname === '/auth/login' || window.location.pathname === '/auth/signup')) {
      router.replace('/dashboard');
    }
  }, [user, router, loading]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};