import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ADMIN_TOKEN_KEY,
  CLIENT_TOKEN_KEY,
  CLIENT_PROJECT_KEY,
  dispatchAuthChanged,
  useAuth,
} from '../hooks/useAdminAuth.js';
import '../styles/admin.css';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const { isAuthenticated, isAdmin, isClient } = useAuth();

  useEffect(() => {
    document.title = 'Đăng Nhập | NORE MEDIA';
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate(redirectPath || '/admin', { replace: true });
      } else if (isClient) {
        navigate(redirectPath || '/tien-do', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, isClient, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      setError('Vui lòng nhập đầy đủ Mã Dự Án / Email và Mật khẩu / Mã PIN.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
      }

      if (data.role === 'admin') {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        dispatchAuthChanged();
        navigate(redirectPath || '/admin', { replace: true });
      } else if (data.role === 'client') {
        localStorage.setItem(CLIENT_TOKEN_KEY, data.token);
        if (data.projectCode) {
          localStorage.setItem(CLIENT_PROJECT_KEY, data.projectCode);
        }
        dispatchAuthChanged();
        navigate(redirectPath || '/tien-do', { replace: true });
      } else {
        throw new Error('Loại tài khoản không xác định.');
      }
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra khi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = (demoId, demoPin) => {
    setIdentifier(demoId);
    setPassword(demoPin);
    setError('');
  };

  return (
    <div className="admin-layout admin-login-layout">
      {/* Background Ambient Glow Orbs */}
      <div className="admin-login-ambient-orb orb-1" aria-hidden="true" />
      <div className="admin-login-ambient-orb orb-2" aria-hidden="true" />
      <div className="admin-login-ambient-orb orb-3" aria-hidden="true" />

      <div className="admin-login-wrapper">
        <motion.div
          className="admin-login-card"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top specular highlight */}
          <div className="admin-login-card-specular" />

          {/* Brand & Title */}
          <div className="admin-login-brand">
            <Link to="/" className="admin-login-logo-glow" title="Về trang chủ NORE MEDIA">
              <img src="/logo.jpg" alt="NORE MEDIA" className="admin-login-logo-img" />
            </Link>
            <h1 className="admin-login-title">NORE MEDIA</h1>
            <div className="admin-login-badge-row">
              <span className="admin-login-badge">
                <span className="admin-live-dot" />
                CỔNG ĐĂNG NHẬP CHUNG
              </span>
            </div>
            <p className="admin-login-subtitle">
              Quản trị studio & Theo dõi tiến độ dự án cho khách hàng
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div style={{
            margin: '0 0 1.25rem 0',
            padding: '0.65rem 0.85rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.65)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)' }}>
                Thử nghiệm nhanh (Demo):
              </span>
              <span style={{ fontSize: '0.72rem', color: '#00e5ff' }}>Bấm để điền mẫu</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleUseDemo('NR-001', '123456')}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '6px',
                  background: 'rgba(0, 229, 255, 0.1)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  color: '#00e5ff',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Khách hàng NR-001
              </button>
              <button
                type="button"
                onClick={() => handleUseDemo('NR-002', '123456')}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '6px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: '#c084fc',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Khách hàng NR-002
              </button>
              <button
                type="button"
                onClick={() => handleUseDemo('admin@noreagency.com', 'NoreAdmin@2026!')}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '6px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Tài khoản Admin
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="admin-alert-error"
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              transition={{ duration: 0.2 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="login-identifier" className="admin-form-label">
                <span>Mã Dự Án hoặc Email</span>
                <span className="admin-label-hint">Khách hàng hoặc Admin</span>
              </label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="login-identifier"
                  type="text"
                  placeholder="VD: NR-001 hoặc admin@noreagency.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="login-password" className="admin-form-label">
                <span>Mã PIN hoặc Mật Khẩu</span>
                <span className="admin-label-hint">6 số PIN hoặc mật khẩu</span>
              </label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mã PIN hoặc mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="admin-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="admin-btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="admin-spinner-circle admin-spinner-sm" />
                  <span>Đang xác thực thông tin...</span>
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>Đăng Nhập</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link & Security Tag */}
          <div className="admin-login-footer">
            <Link to="/" className="admin-link-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Quay lại trang chủ NORE MEDIA</span>
            </Link>
            <div className="admin-login-security-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Bảo mật dữ liệu chuẩn mã hóa 256-bit</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
