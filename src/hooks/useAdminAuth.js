import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const ADMIN_TOKEN_KEY = 'nore_admin_token';
export const CLIENT_TOKEN_KEY = 'nore_client_token';
export const CLIENT_PROJECT_KEY = 'nore_client_project_code';
export const ADMIN_AUTH_EVENT = 'nore_admin_auth_changed';
export const AUTH_CHANGED_EVENT = 'nore_auth_changed';

/**
 * Parses JWT payload safely in browser
 */
export function getJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT token has valid format and hasn't expired
 */
export function isJwtValid(token) {
  const payload = getJwtPayload(token);
  if (!payload) return false;
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return false;
  }
  return true;
}

/**
 * Unified auth helper to compute current state
 */
export function getStoredAuthState() {
  try {
    // Check Admin token
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (adminToken && isJwtValid(adminToken)) {
      const payload = getJwtPayload(adminToken);
      if (payload?.role === 'admin' || payload?.email) {
        return {
          isAuthenticated: true,
          isAdmin: true,
          isClient: false,
          role: 'admin',
          token: adminToken,
          user: payload,
          projectCode: null,
        };
      }
    }

    // Check Client token
    const clientToken = localStorage.getItem(CLIENT_TOKEN_KEY);
    if (clientToken && isJwtValid(clientToken)) {
      const payload = getJwtPayload(clientToken);
      if (payload?.role === 'client' || payload?.projectCode) {
        return {
          isAuthenticated: true,
          isAdmin: false,
          isClient: true,
          role: 'client',
          token: clientToken,
          user: payload,
          projectCode: payload.projectCode || localStorage.getItem(CLIENT_PROJECT_KEY) || '',
        };
      }
    }
  } catch {
    // ignore
  }

  return {
    isAuthenticated: false,
    isAdmin: false,
    isClient: false,
    role: null,
    token: null,
    user: null,
    projectCode: null,
  };
}

/**
 * Helper to dispatch auth change events across components
 */
export function dispatchAuthChanged() {
  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

/**
 * Unified Hook to track authentication for Admin and Client
 */
export function useAuth() {
  const [authState, setAuthState] = useState(getStoredAuthState);
  const location = useLocation();

  const syncState = useCallback(() => {
    setAuthState(getStoredAuthState());
  }, []);

  useEffect(() => {
    syncState();

    window.addEventListener('storage', syncState);
    window.addEventListener(ADMIN_AUTH_EVENT, syncState);
    window.addEventListener(AUTH_CHANGED_EVENT, syncState);

    return () => {
      window.removeEventListener('storage', syncState);
      window.removeEventListener(ADMIN_AUTH_EVENT, syncState);
      window.removeEventListener(AUTH_CHANGED_EVENT, syncState);
    };
  }, [syncState, location.pathname]);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(CLIENT_TOKEN_KEY);
    localStorage.removeItem(CLIENT_PROJECT_KEY);
    dispatchAuthChanged();
    syncState();
  }, [syncState]);

  return {
    ...authState,
    logout,
  };
}

/**
 * Legacy hook for backward compatibility with existing admin components
 */
export function useAdminAuth() {
  const { isAdmin, isClient, role, token, logout } = useAuth();
  return { isAdmin, isClient, role, token, logout };
}
