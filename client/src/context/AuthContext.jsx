import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export const getDiceBearUrl = (seed, style = 'adventurer') => {
  const safeSeed = encodeURIComponent(seed || 'firststep');
  const safeStyle = style || 'adventurer';
  return `https://api.dicebear.com/7.x/${safeStyle}/svg?seed=${safeSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('first_step_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('first_step_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Verify token on initial load
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('first_step_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[Session expired or invalid]:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('first_step_token', newToken);
        localStorage.setItem('first_step_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to sign in. Please verify your credentials.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, avatarStyle = 'adventurer') => {
    setAuthError(null);
    try {
      const res = await authAPI.register({ name, email, password, avatarStyle });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('first_step_token', newToken);
        localStorage.setItem('first_step_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create account. Please check the details.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthError(null);
    localStorage.removeItem('first_step_token');
    localStorage.removeItem('first_step_user');
  };

  const changeAvatar = async (seed, style) => {
    try {
      const res = await authAPI.updateAvatar({ avatarSeed: seed, avatarStyle: style });
      if (res.data.success) {
        const updated = { ...user, avatarSeed: res.data.avatarSeed, avatarStyle: res.data.avatarStyle };
        setUser(updated);
        localStorage.setItem('first_step_user', JSON.stringify(updated));
        return true;
      }
    } catch (err) {
      console.error('Failed to update avatar:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        changeAvatar,
        getDiceBearUrl,
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
