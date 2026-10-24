import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ADMIN_TOKEN_KEY = 'nore_admin_token';
export const ADMIN_AUTH_EVENT = 'nore_admin_auth_changed';

/**
 * Checks if a JWT token has valid format and hasn't expired
 */
export function isJwtValid(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonStr);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Hook to track whether current user is authenticated as Admin
 */
export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      return Boolean(token && isJwtValid(token));
    } catch {
      return false;
    }
  });

  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);
        if (!token || !isJwtValid(token)) {
          if (token) localStorage.removeItem(ADMIN_TOKEN_KEY);
          if (isMounted) setIsAdmin(false);
          return;
        }

        // Optimistically set admin state if valid token exists
        if (isMounted) setIsAdmin(true);

        // Verify with backend
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            if (isMounted) setIsAdmin(false);
          }
        } else {
          if (isMounted) setIsAdmin(true);
        }
      } catch {
        // If network error/offline, retain local state if token is not expired
        try {
          const token = localStorage.getItem(ADMIN_TOKEN_KEY);
          if (isMounted) setIsAdmin(Boolean(token && isJwtValid(token)));
        } catch {
          if (isMounted) setIsAdmin(false);
        }
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener(ADMIN_AUTH_EVENT, handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener(ADMIN_AUTH_EVENT, handleAuthChange);
    };
  }, [location.pathname]);

  return { isAdmin };
}
