import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  CLIENT_TOKEN_KEY,
  ADMIN_TOKEN_KEY,
  CLIENT_PROJECT_KEY,
  dispatchAuthChanged,
  useAuth,
} from '../hooks/useAdminAuth.js';
import {
  STAGES_SEQUENCE,
  getStageIndex,
  isProjectCompleted,
  getStepStatus,
  getNextMilestone,
  isProjectOverdue,
  extractProjectCodeFromQuery,
} from '../utils/progressLogic.js';
import '../styles/client-progress.css';

function formatTime(dateObj) {
  if (!dateObj) return '';
  try {
    return dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function formatDateTime(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function StageIcon({ type }) {
  switch (type) {
    case 'bulb':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
        </svg>
      );
    case 'camera':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case 'sliders':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      );
    case 'message':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case 'award':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

export default function ClientProgressPage() {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem(CLIENT_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  });
  const [projectCodeInput, setProjectCodeInput] = useState(() => {
    const fromQuery = extractProjectCodeFromQuery(window.location.search);
    if (fromQuery) return fromQuery;
    return localStorage.getItem(CLIENT_PROJECT_KEY) || '';
  });
  const [pinInput, setPinInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const pinInputRef = useRef(null);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [refreshError, setRefreshError] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  useEffect(() => {
    document.title = 'Tiến Độ Dự Án | NORE MEDIA';
    const queryCode = extractProjectCodeFromQuery(window.location.search);
    if (queryCode) {
      setProjectCodeInput(queryCode);
      const currentToken = localStorage.getItem(CLIENT_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!currentToken) {
        // Auto-focus on PIN input when project code is supplied via URL
        const timer = setTimeout(() => {
          pinInputRef.current?.focus();
        }, 120);
        return () => clearTimeout(timer);
      } else {
        localStorage.setItem(CLIENT_PROJECT_KEY, queryCode);
      }
    }
  }, []);

  const fetchProgress = useCallback(async (isRefresh = false) => {
    const token = localStorage.getItem(CLIENT_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      setAuthToken('');
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
      setRefreshError('');
    } else {
      setLoading(true);
      setError('');
    }

    try {
      const code = localStorage.getItem(CLIENT_PROJECT_KEY) || '';
      const queryParams = new URLSearchParams();
      if (isRefresh) queryParams.set('refresh', 'true');
      if (code && !code.startsWith('admin')) queryParams.set('code', code);

      const res = await fetch(`/api/client/progress?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        setAuthToken('');
        setProject(null);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Không thể tải thông tin tiến độ dự án.');
      }

      setProject(data.progress);
      setLastFetchedAt(new Date());
      setError('');
      setRefreshError('');
    } catch (err) {
      const msg = err.message || 'Lỗi kết nối khi tải tiến độ.';
      if (isRefresh) {
        setRefreshError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logout]);

  useEffect(() => {
    if (authToken) {
      fetchProgress();
    }
  }, [authToken, fetchProgress]);

  const handleClientLogin = async (e) => {
    e.preventDefault();
    const cleanCode = projectCodeInput.trim().toUpperCase();
    const cleanPin = pinInput.trim();
    if (!cleanCode || !cleanPin) {
      setAuthError('Vui lòng nhập đầy đủ Mã Dự Án và Mã PIN.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanCode, password: cleanPin }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Mã PIN hoặc Mã Dự Án không chính xác.');
      }
      if (data.token) {
        localStorage.setItem(CLIENT_TOKEN_KEY, data.token);
        if (data.projectCode) {
          localStorage.setItem(CLIENT_PROJECT_KEY, data.projectCode);
        }
        setAuthToken(data.token);
        dispatchAuthChanged();
      }
    } catch (err) {
      setAuthError(err.message || 'Lỗi khi xác thực mã PIN.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!project?.projectCode) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(project.projectCode);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = project.projectCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy project code:', err);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthToken('');
    setProject(null);
  };

  const progressPercent = useMemo(() => {
    return Math.min(100, Math.max(0, Number(project?.progress) || 0));
  }, [project?.progress]);

  const currentStageIdx = useMemo(() => {
    return getStageIndex(project?.stage);
  }, [project?.stage]);

  const isCompleted = useMemo(() => {
    return isProjectCompleted(project?.stage, progressPercent, project?.milestones);
  }, [project?.stage, progressPercent, project?.milestones]);

  const isOverdue = useMemo(() => {
    return isProjectOverdue(project?.dueDate, project?.stage, progressPercent, new Date(), project?.milestones);
  }, [project?.dueDate, project?.stage, progressPercent, project?.milestones]);

  const nextMilestone = useMemo(() => {
    return getNextMilestone(project?.milestones);
  }, [project?.milestones]);

  const studioUpdatedTimeFormatted = useMemo(() => {
    if (project?.updatedAt) {
      return formatDateTime(project.updatedAt);
    }
    return '';
  }, [project?.updatedAt]);

  if (!authToken) {
    return (
      <div className="client-progress-root">
        <div className="client-login-gateway-container">
          <div className="client-login-gateway-card">
            <div className="client-login-gateway-header">
              <Link to="/" className="client-logo-link" style={{ textDecoration: 'none' }}>
                <span className="client-logo-text">NORE MEDIA</span>
                <span className="client-logo-badge">CLIENT PORTAL</span>
              </Link>
              <h1 className="client-login-gateway-title">Tra Cứu Tiến Độ Dự Án</h1>
              <p className="client-login-gateway-desc">
                Nhập mã PIN bảo mật do studio cung cấp để truy cập tiến độ sản xuất, duyệt demo và tải sản phẩm hoàn thiện.
              </p>
            </div>

            {authError && (
              <div className="client-login-gateway-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleClientLogin} className="client-login-gateway-form">
              <div className="client-gateway-field">
                <label htmlFor="client-gateway-code">Mã Dự Án</label>
                <input
                  id="client-gateway-code"
                  type="text"
                  placeholder="VD: NR-001"
                  value={projectCodeInput}
                  onChange={(e) => setProjectCodeInput(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="client-gateway-field">
                <label htmlFor="client-gateway-pin">Mã PIN Bảo Mật (6 số)</label>
                <input
                  ref={pinInputRef}
                  id="client-gateway-pin"
                  type="password"
                  placeholder="••••••"
                  maxLength={12}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="client-gateway-submit-btn"
                disabled={authLoading}
              >
                {authLoading ? 'Đang xác thực...' : 'Truy cập tiến độ dự án →'}
              </button>
            </form>

            <div className="client-gateway-footer">
              <span>Cần hỗ trợ quản trị? </span>
              <Link to="/login" style={{ marginLeft: '0.25rem' }}>Đăng nhập quản trị viên</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="client-progress-root">
        <div className="client-loading-state">
          <div className="client-spinner" />
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
            Đang tải dữ liệu tiến độ dự án NORE MEDIA...
          </p>
        </div>
      </div>
    );
  }

  // Only show full error state if initial load failed and we have no project
  if (error && !project) {
    return (
      <div className="client-progress-root">
        <div className="client-progress-container">
          <div className="client-error-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginBottom: '1rem' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Không thể đọc dữ liệu tiến độ</h2>
            <p style={{ color: '#94a3b8', maxWidth: '420px', marginBottom: '1.5rem' }}>
              {error || 'Chưa tìm thấy dự án được liên kết với tài khoản này.'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                className="client-btn-action"
                onClick={() => fetchProgress(false)}
              >
                Thử lại
              </button>
              <button
                type="button"
                className="client-btn-action client-btn-logout"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="client-progress-root">
      <div className="client-progress-container">
        {/* Navigation Bar */}
        <header className="client-header">
          <Link to="/" className="client-header-brand" title="Quay lại trang chủ NORE MEDIA">
            <img src="/logo.jpg" alt="NORE MEDIA" className="client-header-logo" />
            <div className="client-header-title">
              <span>NORE MEDIA</span>
              <span className="client-live-tag">
                <span className="client-live-dot" />
                CLIENT PORTAL
              </span>
            </div>
          </Link>

          <div className="client-header-actions">
            {lastFetchedAt && (
              <span className="client-sync-time" title="Thời điểm trình duyệt đồng bộ dữ liệu gần nhất">
                Đồng bộ: {formatTime(lastFetchedAt)}
              </span>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="client-btn-action"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <span>Quản Trị</span>
              </Link>
            )}

            <button
              type="button"
              className="client-btn-action"
              onClick={() => fetchProgress(true)}
              disabled={refreshing}
              title="Làm mới dữ liệu mới nhất từ Studio"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className={refreshing ? 'client-spin' : ''}
              >
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>{refreshing ? 'Đang cập nhật...' : 'Làm mới'}</span>
            </button>

            <button
              type="button"
              className="client-btn-action client-btn-logout"
              onClick={handleLogout}
              title="Đăng xuất khỏi phiên làm việc"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Refresh Error Notification Banner (Preserving existing data) */}
        <AnimatePresence>
          {refreshError && (
            <motion.div
              className="client-refresh-error-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="client-refresh-error-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Không thể làm mới dữ liệu mới nhất ({refreshError}). Đang hiển thị bản dữ liệu lưu trước đó.</span>
              </div>
              <button
                type="button"
                className="client-refresh-retry-btn"
                onClick={() => fetchProgress(true)}
              >
                Thử lại
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overdue Warning Alert */}
        {isOverdue && (
          <div className="client-overdue-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <strong>Thông báo tiến độ:</strong> Dự án đã quá hạn dự kiến bàn giao ({project.dueDate}). Đội ngũ Studio đang tập trung cao độ để hoàn thiện các khâu nghiệm thu trong thời gian sớm nhất.
            </div>
          </div>
        )}

        {/* Project Hero Card */}
        <motion.div
          className="client-hero-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="client-hero-top">
            <div className="client-hero-info">
              <div className="client-hero-badges-row">
                <button
                  type="button"
                  className="client-project-code-badge"
                  onClick={handleCopyCode}
                  title="Bấm để sao chép mã dự án"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>MÃ DỰ ÁN: {project.projectCode}</span>
                  {copied && <span className="client-copied-hint">✓ Đã chép</span>}
                </button>

                {isCompleted && (
                  <span className="client-status-badge is-completed">
                    ✓ ĐÃ HOÀN TẤT 100%
                  </span>
                )}
                {isOverdue && !isCompleted && (
                  <span className="client-status-badge is-overdue">
                    ⚠️ QUÁ HẠN BÀN GIAO
                  </span>
                )}
              </div>

              <h1 className="client-project-name">{project.projectName}</h1>

              <div className="client-meta-row">
                <div className="client-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Khách hàng: <strong>{project.clientBrand && project.clientBrand !== '—' ? project.clientBrand : 'Khách cá nhân'}</strong></span>
                </div>

                <div className="client-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>Dịch vụ: <strong>{project.service || 'Sản xuất hình ảnh/video'}</strong></span>
                </div>

                <div className="client-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>Phụ trách: <strong>{project.assignee || 'NORE Studio Team'}</strong></span>
                </div>
              </div>
            </div>

            <div className="client-hero-progress-side">
              <div className="client-progress-big-num">{progressPercent}%</div>
              <div className="client-stage-pill">
                <span className="client-live-dot" />
                <span>{project.stage || (isCompleted ? 'Hoàn thành' : 'Đang cập nhật')}</span>
              </div>
            </div>
          </div>

          {/* Master Progress Bar */}
          <div className="client-progressbar-wrapper">
            <div className="client-progressbar-track">
              <div
                className="client-progressbar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="client-dates-row">
              <span>Ngày bắt đầu: <strong>{project.startDate || 'Đang cập nhật'}</strong></span>
              <span>
                Hạn bàn giao:{' '}
                <strong style={{ color: isOverdue ? '#fca5a5' : '#fafafa' }}>
                  {project.dueDate || 'Đang cập nhật'}
                  {isOverdue && ' (Quá hạn)'}
                </strong>
              </span>
              <span className="client-studio-timestamp">
                {studioUpdatedTimeFormatted
                  ? `Studio cập nhật: ${studioUpdatedTimeFormatted}`
                  : 'Nội dung: Cập nhật từ Studio'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Next Milestone Feature Banner */}
        <motion.div
          className="client-next-milestone-banner"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="client-next-milestone-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="client-next-milestone-content">
            <span className="client-next-milestone-label">MỐC TIẾP THEO THEO DÕI</span>
            <div className="client-next-milestone-title">
              {isCompleted ? (
                <span style={{ color: '#34d399' }}>✓ Dự án đã hoàn tất toàn bộ các mốc công việc sản xuất và bàn giao.</span>
              ) : nextMilestone ? (
                <>
                  <span>{nextMilestone.title}</span>
                  <span className={`client-milestone-status-chip ${nextMilestone.status}`}>
                    {nextMilestone.status === 'in_progress' ? 'Đang thực hiện' : 'Chờ xử lý'}
                  </span>
                </>
              ) : (
                <span style={{ color: '#a1a1aa' }}>Chưa có mốc công việc tiếp theo trong kế hoạch.</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* 5-Stage Stepper */}
        <motion.section
          className="client-stepper-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <h2 className="client-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span>Quy Trình & Giai Đoạn Sản Xuất</span>
          </h2>

          <div className="client-stepper-list">
            {STAGES_SEQUENCE.map((stageItem, idx) => {
              const { statusClass, statusText, isCompleted: stepDone } = getStepStatus(
                idx,
                currentStageIdx,
                isCompleted
              );

              return (
                <div key={stageItem.id} className={`client-step-item ${statusClass}`}>
                  <div className="client-step-icon-wrap">
                    {stepDone ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <StageIcon type={stageItem.icon} />
                    )}
                  </div>
                  <div className="client-step-label">{stageItem.label}</div>
                  <div className="client-step-sublabel">{statusText}</div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Two-Column: Milestones & Deliverables */}
        <div className="client-grid-two-col">
          {/* Milestones Checklist */}
          <motion.section
            className="client-milestones-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <div className="client-card-header-row">
              <h2 className="client-section-title" style={{ margin: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>Các Mốc Công Việc (Milestones)</span>
              </h2>
              {Array.isArray(project.milestones) && project.milestones.length > 0 && (
                <span className="client-milestone-count-tag">
                  {project.milestones.filter((m) => m.status === 'completed').length} / {project.milestones.length} hoàn thành
                </span>
              )}
            </div>

            <div className="client-milestones-list">
              {!Array.isArray(project.milestones) || project.milestones.length === 0 ? (
                <div className="client-empty-inline-state">
                  Chưa có danh sách mốc công việc cụ thể cho dự án này.
                </div>
              ) : (
                project.milestones.map((m, mIdx) => {
                  const isDone = m.status === 'completed';
                  const isDoing = m.status === 'in_progress';
                  const bulletClass = isDone ? 'completed' : isDoing ? 'in_progress' : 'pending';
                  const badgeText = isDone ? 'Đã hoàn thành' : isDoing ? 'Đang thực hiện' : 'Chờ xử lý';

                  return (
                    <div key={m.id || mIdx} className={`client-milestone-item ${bulletClass}`}>
                      <div className="client-milestone-left">
                        <div className={`client-milestone-bullet ${bulletClass}`}>
                          {isDone ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : isDoing ? (
                            <span className="client-live-dot" style={{ width: 6, height: 6, background: '#fafafa' }} />
                          ) : (
                            <span style={{ fontSize: '0.65rem' }}>{mIdx + 1}</span>
                          )}
                        </div>
                        <span className="client-milestone-title">{m.title || 'Mốc chưa đặt tên'}</span>
                      </div>

                      <span className={`client-milestone-badge ${bulletClass}`}>
                        {badgeText}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.section>

          {/* Right Column: Deliverables & Studio Notes */}
          <div className="client-deliverables-col">
            {/* Deliverables Card */}
            <motion.section
              className="client-deliverables-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <h2 className="client-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Tài Liệu & Sản Phẩm</span>
              </h2>

              <div className="client-deliverable-action-box">
                {/* Demo Link */}
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="client-dl-button client-dl-demo"
                  >
                    <div className="client-dl-left">
                      <div className="client-dl-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                      <div>
                        <div className="client-dl-title">Xem Bản Nháp Demo</div>
                        <div className="client-dl-desc">Bản xem trước & đóng góp ý kiến</div>
                      </div>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ) : (
                  <div className="client-dl-button client-dl-disabled">
                    <div className="client-dl-left">
                      <div className="client-dl-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                      <div>
                        <div className="client-dl-title">Bản Nháp Demo</div>
                        <div className="client-dl-desc">Đang xử lý, sẽ cập nhật sớm</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Delivery Link */}
                {project.finalUrl ? (
                  <a
                    href={project.finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="client-dl-button client-dl-final"
                  >
                    <div className="client-dl-left">
                      <div className="client-dl-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </div>
                      <div>
                        <div className="client-dl-title">Tải File Bàn Giao Final</div>
                        <div className="client-dl-desc">Bản Master độ phân giải cao & file gốc</div>
                      </div>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ) : (
                  <div className="client-dl-button client-dl-disabled">
                    <div className="client-dl-left">
                      <div className="client-dl-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </div>
                      <div>
                        <div className="client-dl-title">File Bàn Giao Final</div>
                        <div className="client-dl-desc">Sẵn sàng sau khi duyệt bản cuối</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Studio Notes */}
            <motion.section
              className="client-notes-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
            >
              <h2 className="client-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Ghi Chú Từ Studio</span>
              </h2>

              <div className="client-notes-text">
                {project.notes ? (
                  `"${project.notes}"`
                ) : (
                  'Hiện chưa có ghi chú mới từ Studio. Thông tin cập nhật sẽ được hiển thị tại đây khi có thay đổi.'
                )}
              </div>

              <div className="client-support-hint">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Hỗ trợ kỹ thuật & tiến độ: <a href="https://zalo.me/0935997174" target="_blank" rel="noopener noreferrer">Zalo 0935 997 174</a></span>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
