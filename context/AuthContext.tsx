
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { DUMMY_USERS } from '../data/employees';

interface AuthContextType {
  user: User | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.get(STORAGE_KEYS.CURRENT_USER, null));

  const login = (username: string, password?: string) => {
    // Check in storage first (for newly added users) then fallback to DUMMY_USERS
    const storedUsers = storage.get<User[]>(STORAGE_KEYS.USERS, []);
    const allUsers = storedUsers.length > 0 ? storedUsers : DUMMY_USERS;

    const foundUser = allUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      (!password || u.password === password)
    );
    if (foundUser) {
      setUser(foundUser);
      storage.set(STORAGE_KEYS.CURRENT_USER, foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  };

  return (
    <div id="auth-provider-wrapper">
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
