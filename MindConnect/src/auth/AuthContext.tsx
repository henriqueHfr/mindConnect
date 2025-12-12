// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchWithAuth as apiFetchWithAuth, apiPost, apiUpload } from '../api/api';

type User = { id: string; name: string; email: string; role?: string; avatarUrl?: string; bio?: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<any>;
  updateProfile: (name?: string, bio?: string, avatarUri?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('auth');
        if (raw) {
          const parsed = JSON.parse(raw);
          setToken(parsed.token);
          setUser(parsed.user);
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function persist(tokenVal: string | null, userVal: User | null) {
    setToken(tokenVal);
    setUser(userVal);
    if (tokenVal && userVal) {
      await AsyncStorage.setItem('auth', JSON.stringify({ token: tokenVal, user: userVal }));
    } else {
      await AsyncStorage.removeItem('auth');
    }
  }

  async function login(email: string, password: string) {
    const res = await apiPost('/api/auth/login', { email, password });
    if (res.token) {
      await persist(res.token, res.user);
    } else {
      throw new Error(res.error || 'Login failed');
    }
  }

  async function register(name: string, email: string, password: string, role?: string) {
    const res = await apiPost('/api/auth/register', { name, email, password, role });
    if (res.token) {
      await persist(res.token, res.user);
    } else {
      throw new Error(res.error || 'Register failed');
    }
  }

  async function logout() {
    await persist(null, null);
  }

  // wrapper so API helper can call logout on 401
  function onUnauthorized() {
    logout();
  }

  async function updateProfile(name?: string, bio?: string, avatarUri?: string) {
    if (!token) throw new Error('not_authenticated');

    const formData = new FormData();
    if (name !== undefined) formData.append('name', name);
    if (bio !== undefined) formData.append('bio', bio);

    if (avatarUri) {
      const response = await fetch(avatarUri);
      const blob = await response.blob();
      const segments = (avatarUri || '').split('/');
      const filename = segments[segments.length - 1] || 'avatar.jpg';
      formData.append('avatar', {
        // @ts-ignore - React Native FormData file shape
        uri: avatarUri,
        name: filename,
        type: blob.type || 'image/jpeg',
      } as any);
    }

    const res = await apiUpload('/api/users/me', formData, token, onUnauthorized);
    if (res && res.id) {
      const updated = { ...(user as any), ...res };
      await persist(token, updated);
    } else {
      throw new Error(res?.error || 'update_failed');
    }
  }

  function fetchWithAuthWrapper(input: RequestInfo, init?: RequestInit) {
    return apiFetchWithAuth(input, init, token, onUnauthorized);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchWithAuth: fetchWithAuthWrapper, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
