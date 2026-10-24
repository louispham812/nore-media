import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu quản trị.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại.');
      }

      onLoginSuccess(data.token, data.admin);
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra khi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
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
          {/* Card Top Highlight Line */}
          <div className="admin-login-card-specular" />

          {/* Brand & Security Header */}
          <div className="admin-login-brand">
            <div className="admin-login-logo-glow">
              <img src="/logo.jpg" alt="NORE MEDIA" className="admin-login-logo-img" />
            </div>
            <h1 className="admin-login-title">NORE MEDIA</h1>
            <div className="admin-login-badge-row">
              <span className="admin-login-badge">
                <span className="admin-live-dot" />
                STUDIO ADMIN PORTAL
              </span>
            </div>
            <p className="admin-login-subtitle">
              Cổng quản trị dự án & vận hành sản xuất truyền thông
            </p>
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
              <label htmlFor="admin-email" className="admin-form-label">
                <span>Email Quản Trị</span>
                <span className="admin-label-hint">Tài khoản nội bộ</span>
              </label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@noreagency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-password" className="admin-form-label">
                <span>Mật Khẩu</span>
                <span className="admin-label-hint">Khóa bảo mật</span>
              </label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
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
                  <span>Đang xác thực bảo mật...</span>
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>Đăng Nhập Quản Trị</span>
                </>
              )}
            </button>
          </form>

          {/* Security Note & Back link */}
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
              <span>Phiên kết nối được mã hóa bảo mật chuẩn 256-bit</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
