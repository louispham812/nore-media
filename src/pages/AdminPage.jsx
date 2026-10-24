import { useState, useEffect, useCallback } from 'react';
import AdminLogin from '../components/admin/AdminLogin.jsx';
import AdminPortal from '../components/admin/AdminPortal.jsx';
import { ADMIN_TOKEN_KEY, ADMIN_AUTH_EVENT } from '../hooks/useAdminAuth.js';
import '../styles/admin.css';

const TOKEN_KEY = ADMIN_TOKEN_KEY;

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [admin, setAdmin] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [sheetsData, setSheetsData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Admin Portal | NORE MEDIA';
  }, []);

  // Fetch Sheets Data from Backend API
  const fetchSheetsData = useCallback(async (authToken, isRefresh = false) => {
    if (!authToken) return;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoadingData(true);
    }
    setError('');

    try {
      const url = `/api/admin/sheets-data${isRefresh ? '?refresh=true' : ''}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.status === 401) {
        // Token expired
        localStorage.removeItem(TOKEN_KEY);
        setToken('');
        setAdmin(null);
        window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Không thể tải dữ liệu hệ thống.');
      }

      setSheetsData(data);
    } catch (err) {
      setError(err.message || 'Lỗi kết nối khi lấy dữ liệu hệ thống.');
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  }, []);

  // Validate Token on Mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        if (isMounted) setAuthChecking(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });

        if (!res.ok) {
          throw new Error('Token không hợp lệ');
        }

        const data = await res.json();
        if (isMounted) {
          setAdmin(data.admin || { email: 'admin' });
          setToken(savedToken);
          fetchSheetsData(savedToken);
        }
      } catch {
        if (isMounted) {
          localStorage.removeItem(TOKEN_KEY);
          setToken('');
          setAdmin(null);
        }
      } finally {
        if (isMounted) setAuthChecking(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [fetchSheetsData]);

  // Handle Login Success
  const handleLoginSuccess = (newToken, adminInfo) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setAdmin(adminInfo);
    window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
    fetchSheetsData(newToken);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setAdmin(null);
    setSheetsData(null);
    window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
  };

  // Handle Manual Refresh
  const handleRefresh = () => {
    if (token) {
      fetchSheetsData(token, true);
    }
  };

  if (authChecking) {
    return (
      <div className="admin-layout admin-loading-fullscreen">
        <div className="admin-spinner-circle admin-spinner-lg" />
        <p className="admin-loading-text">Đang xác thực phiên quản trị NORE MEDIA...</p>
      </div>
    );
  }

  if (!token) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      {error && (
        <div className="admin-global-error-banner">
          <div className="admin-global-error-content">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{error}</span>
            <button
              type="button"
              onClick={handleRefresh}
              className="admin-error-retry-btn"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}
      <AdminPortal
        admin={admin}
        data={sheetsData}
        loading={loadingData}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        token={token}
      />
    </>
  );
}
