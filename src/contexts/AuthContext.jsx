import { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { getStorage, setStorage } from '../utils/storage';

const AuthContext = createContext();

const getUserKey = (user) => user?.id || user?.username || user?.email || 'guest';

const defaultPreferences = {
  occasion: '',
  fit: '',
  budget: '',
  deadline: '',
  comment: '',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const enrichUser = useCallback((rawUser) => {
    if (!rawUser) return null;

    const key = getUserKey(rawUser);
    return {
      ...rawUser,
      name: rawUser.name || rawUser.username || rawUser.email || 'Клиент',
      measurements: getStorage(`maison_measurements_${key}`, {}),
      preferences: getStorage(`maison_preferences_${key}`, defaultPreferences),
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      api.me()
        .then((me) => setUser(enrichUser(me)))
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [enrichUser]);

  const login = async (username, password) => {
    const data = await api.login({ username: username.trim(), password });
    localStorage.setItem('token', data.access);
    localStorage.setItem('refresh', data.refresh);
    const me = await api.me();
    const enriched = enrichUser(me);
    setUser(enriched);
    return enriched;
  };

  const register = async (username, email, password) => {
    const cleanUsername = username.trim();
    await api.register({ username: cleanUsername, email: email.trim(), password });
    return login(cleanUsername, password);
  };

  const updateProfile = async (profile) => {
    if (!user) return null;

    const updated = await api.updateMe({
      username: (profile.username || user.username || '').trim(),
      email: (profile.email || '').trim(),
      phone: (profile.phone || '').trim(),
      address: (profile.address || '').trim(),
    });

    const enriched = enrichUser(updated);
    setUser(enriched);
    return enriched;
  };

  const updateMeasurements = (measurements) => {
    if (!user) return;

    const key = getUserKey(user);
    setStorage(`maison_measurements_${key}`, measurements);
    setUser((current) => current ? { ...current, measurements } : current);
  };

  const updatePreferences = (preferences) => {
    if (!user) return;

    const key = getUserKey(user);
    setStorage(`maison_preferences_${key}`, preferences);
    setUser((current) => current ? { ...current, preferences } : current);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  const users = user ? [{ ...user, orders: user.orders || [] }] : [];
  const updateUserOrder = () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        login,
        register,
        updateProfile,
        updateMeasurements,
        updatePreferences,
        updateUserOrder,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
