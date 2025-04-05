import { useState, useEffect } from 'react';
import { USER_KEY } from "@/app/actions/auth"
import { User } from '@/app/interface/user.interface';

function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userString = localStorage.getItem(USER_KEY);
        if (userString) {
          setCurrentUser(JSON.parse(userString));
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error reading user from localStorage:', error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentUser(null);
      setIsLoading(false);
    }
  }, []);

  return { currentUser, isLoading };
}

export default useCurrentUser;