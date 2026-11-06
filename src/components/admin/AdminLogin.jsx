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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại.');
      }

      if (data.role === 'admin') {
        onLoginSuccess(data.token, data.user || data.admin);
      } else if (data.role === 'client') {
        localStorage.setItem('nore_client_token', data.token);
        if (data.projectCode) {
          localStorage.setItem('nore_client_project_code', data.projectCode);
        }
        window.location.href = '/tien-do';
      }
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra khi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout admin-login-layout">
      <div className="admin-login-shell">
        {/* Left Column: Editorial Studio Identity */}
        <aside className="admin-login-showcase" aria-label="Giới thiệu hệ thống quản trị NORE MEDIA">
          <div className="admin-login-showcase-top">
            <Link to="/" className="admin-login-showcase-brand">
              <img src="/logo.jpg" alt="NORE MEDIA" className="admin-login-logo-img" />
              <div className="admin-login-showcase-brand-text">
                <span className="admin-login-showcase-name">NORE MEDIA</span>
                <span className="admin-login-showcase-tag">STUDIO ADMIN</span>
              </div>
            </Link>
          </div>

          <div className="admin-login-showcase-body">
            <span className="admin-login-eyebrow">INTERNAL MANAGEMENT</span>
            <h2 className="admin-login-showcase-heading">
              Hệ thống điều hành sản xuất &amp; quản trị khách hàng.
            </h2>
            <p className="admin-login-showcase-desc">
              Đồng bộ thời gian thực với Google Sheets, quản lý danh mục dự án, cập nhật tiến độ sản xuất và xử lý yêu cầu tư vấn từ website.
            </p>

            <div className="admin-login-feature-list">
              <div className="admin-login-feature-item">
                <span className="admin-login-feature-index">01</span>
                <div>
                  <strong>Quản lý tiến độ &amp; bàn giao</strong>
                  <p>Cập nhật giai đoạn sản xuất, mốc công việc (milestones), đường dẫn bản nháp và file nghiệm thu.</p>
                </div>
              </div>
              <div className="admin-login-feature-item">
                <span className="admin-login-feature-index">02</span>
                <div>
                  <strong>Theo dõi doanh thu &amp; khách hàng</strong>
                  <p>Kiểm soát giá trị hợp đồng, trạng thái thanh toán và phản hồi nhanh các yêu cầu liên hệ.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-login-showcase-footer">
            <span>© {new Date().getFullYear()} NORE MEDIA</span>
            <span className="admin-login-dot-sep">·</span>
            <span>Bản quyền nội bộ Studio</span>
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
            {/* Brand & Security Header */}
            <div className="admin-login-brand">
              <div className="admin-login-brand-row">
                <Link to="/" className="admin-login-logo-glow" title="Về trang chủ NORE MEDIA">
                  <img src="/logo.jpg" alt="NORE MEDIA" className="admin-login-logo-img" />
                </Link>
                <div>
                  <span className="admin-login-badge">STUDIO ADMIN PORTAL</span>
                  <h1 className="admin-login-title">Xác thực quản trị</h1>
                </div>
              </div>
              <p className="admin-login-subtitle">
                Đăng nhập bằng tài khoản quản trị viên để truy cập bảng điều khiển.
              </p>
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
                <label htmlFor="admin-email" className="admin-form-label">
                  <span>Email hoặc Mã dự án</span>
                  <span className="admin-label-hint">Tài khoản nội bộ</span>
                </label>
                <div className="admin-input-wrap">
                  <span className="admin-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="admin-email"
                    type="text"
                    placeholder="admin@noreagency.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="admin-password" className="admin-form-label">
                  <span>Mật khẩu</span>
                  <span className="admin-label-hint">Khóa bảo mật</span>
                </label>
                <div className="admin-input-wrap">
                  <span className="admin-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu quản trị"
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
                    <span>Đăng nhập Quản trị</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Security Note & Back link */}
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
