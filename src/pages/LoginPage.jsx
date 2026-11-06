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
      <div className="admin-login-shell">
        {/* Left Column: Editorial Studio Identity */}
        <aside className="admin-login-showcase" aria-label="Giới thiệu cổng truy cập NORE MEDIA">
          <div className="admin-login-showcase-top">
            <Link to="/" className="admin-login-showcase-brand">
              <img src="/logo.jpg" alt="NORE MEDIA" className="admin-login-logo-img" />
              <div className="admin-login-showcase-brand-text">
                <span className="admin-login-showcase-name">NORE MEDIA</span>
                <span className="admin-login-showcase-tag">STUDIO PORTAL</span>
              </div>
            </Link>
          </div>

          <div className="admin-login-showcase-body">
            <span className="admin-login-eyebrow">CREATIVE PRODUCTION HOUSE</span>
            <h2 className="admin-login-showcase-heading">
              Không gian làm việc &amp; theo dõi dự án trực tuyến.
            </h2>
            <p className="admin-login-showcase-desc">
              Truy cập tiến độ sản xuất thời gian thực, duyệt bản nháp demo, tải file bàn giao gốc hoặc vận hành hệ thống studio.
            </p>

            <div className="admin-login-feature-list">
              <div className="admin-login-feature-item">
                <span className="admin-login-feature-index">01</span>
                <div>
                  <strong>Dành cho Khách hàng</strong>
                  <p>Nhập Mã Dự Án (VD: NR-001) và mã PIN 6 số để xem tiến độ &amp; nghiệm thu sản phẩm.</p>
                </div>
              </div>
              <div className="admin-login-feature-item">
                <span className="admin-login-feature-index">02</span>
                <div>
                  <strong>Dành cho Quản trị viên</strong>
                  <p>Đăng nhập bằng Email công việc để điều phối lịch trình, nhân sự và dữ liệu khách hàng.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-login-showcase-footer">
            <span>© {new Date().getFullYear()} NORE MEDIA</span>
            <span className="admin-login-dot-sep">·</span>
            <span>TP. Hồ Chí Minh, Việt Nam</span>
          </div>
        </aside>

        {/* Right Column: Clean Monochrome Form */}
        <div className="admin-login-wrapper">
          <motion.div
            className="admin-login-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Brand Header */}
            <div className="admin-login-brand">
              <div className="admin-login-brand-row">
                <Link to="/" className="admin-login-logo-glow" title="Về trang chủ NORE MEDIA">
                  <img src="/logo.jpg" alt="NORE MEDIA" className="admin-login-logo-img" />
                </Link>
                <div>
                  <span className="admin-login-badge">CỔNG ĐĂNG NHẬP CHUNG</span>
                  <h1 className="admin-login-title">Đăng nhập hệ thống</h1>
                </div>
              </div>
              <p className="admin-login-subtitle">
                Sử dụng thông tin dự án được cấp hoặc tài khoản quản trị NORE MEDIA.
              </p>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="admin-demo-box">
              <div className="admin-demo-header">
                <span className="admin-demo-label">Tài khoản thử nghiệm</span>
                <span className="admin-demo-hint">Chọn để điền nhanh</span>
              </div>
              <div className="admin-demo-actions">
                <button
                  type="button"
                  className="admin-demo-chip"
                  onClick={() => handleUseDemo('NR-001', '123456')}
                >
                  <span className="admin-demo-chip-code">NR-001</span>
                  <span>Khách hàng 1</span>
                </button>
                <button
                  type="button"
                  className="admin-demo-chip"
                  onClick={() => handleUseDemo('NR-002', '123456')}
                >
                  <span className="admin-demo-chip-code">NR-002</span>
                  <span>Khách hàng 2</span>
                </button>
                <button
                  type="button"
                  className="admin-demo-chip"
                  onClick={() => handleUseDemo('admin@noreagency.com', 'NoreAdmin@2026!')}
                >
                  <span className="admin-demo-chip-code">ADMIN</span>
                  <span>Quản trị viên</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="admin-alert-error" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form className="admin-login-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label htmlFor="login-identifier" className="admin-form-label">
                  <span>Mã dự án hoặc Email</span>
                  <span className="admin-label-hint">Khách hàng / Admin</span>
                </label>
                <div className="admin-input-wrap">
                  <span className="admin-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                  <span>Mã PIN hoặc Mật khẩu</span>
                  <span className="admin-label-hint">6 số PIN / Mật khẩu</span>
                </label>
                <div className="admin-input-wrap">
                  <span className="admin-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Tiếp tục</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer Back Link & Security Tag */}
            <div className="admin-login-footer">
              <Link to="/" className="admin-link-back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Quay về trang chủ</span>
              </Link>
              <div className="admin-login-security-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Kết nối bảo mật SSL/TLS</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
