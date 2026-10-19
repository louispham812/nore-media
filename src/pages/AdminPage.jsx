import { useState, useEffect, useCallback } from 'react';
import AdminLogin from '../components/admin/AdminLogin.jsx';
import AdminPortal from '../components/admin/AdminPortal.jsx';
import '../styles/admin.css';

const TOKEN_KEY = 'nore_admin_token';

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
    fetchSheetsData(newToken);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setAdmin(null);
    setSheetsData(null);
  };

  // Handle Manual Refresh
  const handleRefresh = () => {
    if (token) {
      fetchSheetsData(token, true);
    }
  };

  if (authChecking) {
    return (
      <div className="admin-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="admin-spinner" />
      </div>
    );
  }

  if (!token) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      {error && (
        <div style={{ background: '#7f1d1d', color: '#fee2e2', padding: '0.75rem 1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          {error}
          <button
            onClick={handleRefresh}
            style={{ marginLeft: '1rem', background: '#ffffff', color: '#000000', border: 'none', padding: '0.2rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
          >
            Thử lại
          </button>
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
