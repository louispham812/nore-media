import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CustomSelect from './CustomSelect.jsx';
import DatePicker from './DatePicker.jsx';

function formatTime(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '';
  }
}

function formatDateTime(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

function parseCurrencyNumber(str) {
  if (!str) return 0;
  const num = parseInt(str.replace(/[^\d]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

const STAGE_OPTIONS = [
  'Đề xuất / Pitching',
  'Đang đàm phán',
  'Tiền kỳ',
  'Đang sản xuất',
  'Hậu kỳ',
  'Hoàn thành',
];

const PAYMENT_OPTIONS = [
  'Chưa thanh toán',
  'Đã đặt cọc 50%',
  'Đã thanh toán 100%',
];

const SERVICE_SUGGESTIONS = [
  'TVC Quảng cáo',
  'Viral Video',
  'MV Ca nhạc',
  'Photoshoot',
];

export default function AdminPortal({ admin, data, loading, refreshing, onRefresh, onLogout, token }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'projects' | 'form_submissions'

  // Search & Filters for Projects
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');

  // Search for Form Submissions
  const [formSearchQuery, setFormSearchQuery] = useState('');

  // Modal State (Add / Edit Project)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    brand: '',
    service: '',
    assignee: '',
    stage: 'Đang đàm phán',
    value: '',
    paymentStatus: 'Chưa thanh toán',
    startDate: '',
    dueDate: '',
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirm Dialog State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const dashboard = data?.dashboard || { kpis: [], revenueByGenre: [], stageDistribution: [] };
  const projects = data?.projects || [];
  const formSubmissions = data?.formSubmissions || [];

  // Filter Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q) ||
        p.assignee.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);

      const matchStage = selectedStage === 'all' || p.stage === selectedStage;
      const matchPayment = selectedPayment === 'all' || p.paymentStatus === selectedPayment;

      return matchQuery && matchStage && matchPayment;
    });
  }, [projects, searchQuery, selectedStage, selectedPayment]);

  // Filter Form Submissions
  const filteredSubmissions = useMemo(() => {
    return formSubmissions.filter((sub) => {
      const q = formSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        sub.name.toLowerCase().includes(q) ||
        sub.phone.toLowerCase().includes(q) ||
        sub.email.toLowerCase().includes(q) ||
        sub.message.toLowerCase().includes(q)
      );
    });
  }, [formSubmissions, formSearchQuery]);

  // Service options from Google Sheet dropdownOptions, with project fallback
  const serviceOptions = useMemo(() => {
    const fromApi = data?.dropdownOptions?.services;
    if (Array.isArray(fromApi) && fromApi.length > 0) {
      return fromApi;
    }
    const set = new Set(SERVICE_SUGGESTIONS);
    (projects || []).forEach((p) => {
      if (p.service && p.service !== '—') set.add(p.service);
    });
    return Array.from(set).filter(Boolean);
  }, [data?.dropdownOptions?.services, projects]);

  // Modal Stage options from Google Sheet dropdownOptions
  const allStageOptions = useMemo(() => {
    const fromApi = data?.dropdownOptions?.stages;
    const set = new Set(
      Array.isArray(fromApi) && fromApi.length > 0
        ? fromApi
        : STAGE_OPTIONS
    );
    (projects || []).forEach((p) => {
      if (p.stage && p.stage !== '—') set.add(p.stage);
    });
    return Array.from(set).filter(Boolean);
  }, [data?.dropdownOptions?.stages, projects]);

  // Modal Payment options from Google Sheet dropdownOptions
  const allPaymentOptions = useMemo(() => {
    const fromApi = data?.dropdownOptions?.paymentStatuses;
    const set = new Set(
      Array.isArray(fromApi) && fromApi.length > 0
        ? fromApi
        : PAYMENT_OPTIONS
    );
    (projects || []).forEach((p) => {
      if (p.paymentStatus && p.paymentStatus !== '—') set.add(p.paymentStatus);
    });
    return Array.from(set).filter(Boolean);
  }, [data?.dropdownOptions?.paymentStatuses, projects]);

  // Unique stages and payments for filters
  const stageOptions = useMemo(() => {
    const set = new Set(projects.map((p) => p.stage).filter(Boolean));
    return Array.from(set);
  }, [projects]);

  const paymentOptions = useMemo(() => {
    const set = new Set(projects.map((p) => p.paymentStatus).filter(Boolean));
    return Array.from(set);
  }, [projects]);

  // Calculate max genre revenue for progress bars
  const maxGenreRevenue = useMemo(() => {
    let max = 0;
    dashboard.revenueByGenre.forEach((item) => {
      if (!item.isTotal) {
        const val = parseCurrencyNumber(item.revenue);
        if (val > max) max = val;
      }
    });
    return max || 1;
  }, [dashboard.revenueByGenre]);

  // Quick Summary Stats for modern executive overview ribbon
  const quickStats = useMemo(() => {
    const totalP = projects.length;
    const prodCount = projects.filter((p) => {
      const s = (p.stage || '').toLowerCase();
      return s.includes('sản xuất') || s.includes('tiền kỳ') || s.includes('hậu kỳ');
    }).length;
    const doneCount = projects.filter((p) => (p.stage || '').toLowerCase().includes('hoàn thành')).length;
    const totalLeads = formSubmissions.length;

    return {
      totalP,
      prodCount,
      doneCount,
      totalLeads,
    };
  }, [projects, formSubmissions]);

  // Handle Open Add Modal
  const handleOpenAddModal = () => {
    const existingIds = projects
      .map((p) => parseInt(String(p.id).trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    setFormData({
      id: String(nextId),
      name: '',
      brand: '',
      service: serviceOptions[0] || 'TVC Quảng cáo',
      assignee: '',
      stage: allStageOptions[0] || 'Đang đàm phán',
      value: '',
      paymentStatus: allPaymentOptions[0] || 'Chưa thanh toán',
      startDate: new Date().toLocaleDateString('vi-VN'),
      dueDate: '',
    });
    setFormError('');
    setModalMode('add');
    setModalOpen(true);
  };

  // Handle Open Edit Modal
  const handleOpenEditModal = (project) => {
    setFormData({
      id: project.id,
      name: project.name,
      brand: project.brand === '—' ? '' : project.brand,
      service: project.service === '—' ? '' : project.service,
      assignee: project.assignee === '—' ? '' : project.assignee,
      stage: project.stage || 'Đang đàm phán',
      value: project.value || '',
      paymentStatus: project.paymentStatus || 'Chưa thanh toán',
      startDate: project.startDate === '—' ? '' : project.startDate,
      dueDate: project.dueDate === '—' ? '' : project.dueDate,
    });
    setFormError('');
    setModalMode('edit');
    setModalOpen(true);
  };

  // Save Project (Add / Edit)
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Vui lòng nhập Tên khách hàng / Dự án.');
      return;
    }

    setFormSaving(true);
    setFormError('');

    try {
      const isEdit = modalMode === 'edit';
      const endpoint = isEdit ? `/api/admin/projects/${encodeURIComponent(formData.id)}` : '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Thao tác không thành công.');
      }

      setModalOpen(false);
      showToast(isEdit ? 'Đã cập nhật thông tin dự án thành công!' : 'Đã thêm dự án mới thành công!');
      onRefresh();
    } catch (err) {
      setFormError(err.message || 'Đã có lỗi xảy ra khi lưu dữ liệu.');
    } finally {
      setFormSaving(false);
    }
  };

  // Delete Project
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(projectToDelete.id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Không thể xóa dự án.');
      }

      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      showToast('Đã xóa dự án thành công!');
      onRefresh();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa dự án.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-layout">
      {/* Toast Notification */}
      {toast && (
        <motion.div
          className={`admin-toast-float ${toast.type === 'error' ? 'admin-toast-error' : 'admin-toast-success'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {toast.type === 'error' ? '⚠️' : '✅'}
          <span>{toast.message}</span>
        </motion.div>
      )}

      {/* Sticky Site Header matching Homepage */}
      <header className="admin-site-header">
        <div className="container admin-nav-wrap">
          <div className="admin-brand-group">
            <Link to="/admin" className="admin-brand-link" title="NORE MEDIA — Admin Workspace">
              <img src="/logo.jpg" alt="NORE" className="admin-brand-img" />
              <div className="admin-brand-meta">
                <span className="admin-brand-name">NORE MEDIA</span>
                <span className="admin-brand-sep">/</span>
                <span className="admin-brand-sub">Workspace</span>
              </div>
            </Link>
          </div>

          <div className="admin-tab-group" role="tablist">
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
              role="tab"
              aria-selected={activeTab === 'dashboard'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
              </svg>
              <span>Tổng quan</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
              role="tab"
              aria-selected={activeTab === 'projects'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Dự án</span>
              <span className="admin-tab-count">{projects.length}</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'form_submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('form_submissions')}
              role="tab"
              aria-selected={activeTab === 'form_submissions'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Khách điền Form</span>
              <span className="admin-tab-count">{formSubmissions.length}</span>
            </button>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="admin-sync-btn"
              onClick={onRefresh}
              disabled={refreshing || loading}
              title={`Đồng bộ lúc ${data?.updatedAt ? formatTime(data.updatedAt) : 'vừa xong'} • Nhấn để làm mới`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className={refreshing ? 'admin-spinner-circle' : ''}
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span className="admin-sync-time">
                {refreshing ? 'Đang tải...' : (data?.updatedAt ? formatTime(data.updatedAt) : 'Đồng bộ')}
              </span>
            </button>

            <Link to="/" className="admin-pill-btn" title="Về trang chủ NORE MEDIA">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Trang chủ</span>
            </Link>

            <div className="admin-user-group">
              <div className="admin-user-info" title={admin?.email || 'admin@noreagency.com'}>
                <span className="admin-user-avatar">
                  {(admin?.email || 'A')[0].toUpperCase()}
                </span>
                <span className="admin-user-name">
                  {(admin?.email || 'admin').split('@')[0]}
                </span>
              </div>
              <div className="admin-user-divider" />
              <button
                type="button"
                className="admin-user-logout-btn"
                onClick={onLogout}
                title="Đăng xuất khỏi hệ thống"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-main-container">
        {/* Modern Executive Stat Cards Ribbon */}
        <div className="admin-quick-stats-ribbon">
          <div className="admin-quick-stat-card">
            <div className="admin-quick-stat-icon-wrap icon-projects">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="admin-quick-stat-info">
              <span className="admin-quick-stat-label">Tổng Dự Án CRM</span>
              <div className="admin-quick-stat-value-row">
                <span className="admin-quick-stat-value">{quickStats.totalP}</span>
                <span className="admin-quick-stat-badge badge-cyan">Hồ sơ lưu trữ</span>
              </div>
            </div>
          </div>

          <div className="admin-quick-stat-card">
            <div className="admin-quick-stat-icon-wrap icon-production">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <div className="admin-quick-stat-info">
              <span className="admin-quick-stat-label">Đang Sản Xuất</span>
              <div className="admin-quick-stat-value-row">
                <span className="admin-quick-stat-value">{quickStats.prodCount}</span>
                <span className="admin-quick-stat-badge badge-indigo">Đang triển khai</span>
              </div>
            </div>
          </div>

          <div className="admin-quick-stat-card">
            <div className="admin-quick-stat-icon-wrap icon-leads">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="admin-quick-stat-info">
              <span className="admin-quick-stat-label">Khách Điền Form</span>
              <div className="admin-quick-stat-value-row">
                <span className="admin-quick-stat-value">{quickStats.totalLeads}</span>
                <span className="admin-quick-stat-badge badge-amber">Yêu cầu từ web</span>
              </div>
            </div>
          </div>

          <div className="admin-quick-stat-card">
            <div className="admin-quick-stat-icon-wrap icon-completed">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="admin-quick-stat-info">
              <span className="admin-quick-stat-label">Dự Án Hoàn Thành</span>
              <div className="admin-quick-stat-value-row">
                <span className="admin-quick-stat-value">{quickStats.doneCount}</span>
                <span className="admin-quick-stat-badge badge-emerald">Đã nghiệm thu</span>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="admin-loader-center">
            <div className="admin-spinner-circle" />
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', whiteSpace: 'nowrap' }}>
              Đang đồng bộ dữ liệu hệ thống...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="tab-dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="admin-hero-heading">
                  <span className="admin-section-tag">TRUNG TÂM QUẢN TRỊ KINH DOANH</span>
                  <h2 className="admin-hero-title">Tổng Quan Chỉ Số Kinh Doanh</h2>
                  <p className="admin-hero-desc">
                    Số liệu phân tích thời gian thực từ hệ thống quản trị NORE MEDIA
                  </p>
                </div>

                {/* 4 KPI Cards */}
                <div className="admin-kpi-grid">
                  {dashboard.kpis.map((kpi, idx) => (
                    <motion.div
                      key={kpi.key || idx}
                      className="admin-kpi-card"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="admin-kpi-top">
                        <span className="admin-kpi-title">{kpi.title}</span>
                        <div className="admin-kpi-icon">
                          {kpi.key === 'projects' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                            </svg>
                          )}
                          {kpi.key === 'pipeline' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="1" x2="12" y2="23" />
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          )}
                          {kpi.key === 'completedRevenue' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                          )}
                          {kpi.key === 'completionRate' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="20" x2="18" y2="10" />
                              <line x1="12" y1="20" x2="12" y2="4" />
                              <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="admin-kpi-value">{kpi.value}</div>
                      {kpi.note && <p className="admin-kpi-note">{kpi.note}</p>}
                    </motion.div>
                  ))}
                </div>

                {/* 2 Breakdown Panels */}
                <div className="admin-breakdowns-grid">
                  <div className="admin-glass-panel">
                    <h3 className="admin-panel-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                      <span>Doanh Thu Theo Thể Loại Sản Xuất</span>
                    </h3>

                    {dashboard.revenueByGenre.length === 0 ? (
                      <div className="admin-empty-box">Chưa có dữ liệu thể loại sản xuất</div>
                    ) : (
                      <table className="admin-list-table">
                        <thead>
                          <tr>
                            <th>Thể Loại Sản Xuất</th>
                            <th style={{ textAlign: 'center' }}>Số Dự Án</th>
                            <th style={{ textAlign: 'right' }}>Doanh Thu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboard.revenueByGenre.map((item, i) => {
                            const revNum = parseCurrencyNumber(item.revenue);
                            const percent = maxGenreRevenue > 0 ? Math.min(100, Math.round((revNum / maxGenreRevenue) * 100)) : 0;
                            return (
                              <tr key={i} className={item.isTotal ? 'total-row' : ''}>
                                <td>
                                  <div>{item.genre}</div>
                                  {!item.isTotal && revNum > 0 && (
                                    <div className="admin-progress-track">
                                      <div className="admin-progress-bar-fill" style={{ width: `${percent}%` }} />
                                    </div>
                                  )}
                                </td>
                                <td style={{ textAlign: 'center' }}>{item.projectCount}</td>
                                <td style={{ textAlign: 'right', fontWeight: item.isTotal ? 800 : 600 }}>
                                  {item.revenue}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="admin-glass-panel">
                    <h3 className="admin-panel-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>Phân Bổ Theo Giai Đoạn Dự Án</span>
                    </h3>

                    {dashboard.stageDistribution.length === 0 ? (
                      <div className="admin-empty-box">Chưa có dữ liệu phân bổ giai đoạn</div>
                    ) : (
                      <table className="admin-list-table">
                        <thead>
                          <tr>
                            <th>Giai Đoạn Thực Hiện</th>
                            <th style={{ textAlign: 'center' }}>Số Dự Án</th>
                            <th style={{ textAlign: 'right' }}>Tỷ Lệ (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboard.stageDistribution.map((item, i) => {
                            const pctValue = parseFloat((item.percentage || '').replace('%', '').replace(',', '.')) || 0;
                            return (
                              <tr key={i}>
                                <td>
                                  <div>{item.stage}</div>
                                  <div className="admin-progress-track">
                                    <div
                                      className="admin-progress-bar-fill"
                                      style={{
                                        width: `${Math.min(100, pctValue)}%`,
                                        background: pctValue > 0 ? 'linear-gradient(90deg, #ffffff, rgba(255,255,255,0.7))' : 'rgba(255,255,255,0.15)',
                                      }}
                                    />
                                  </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>{item.projectCount}</td>
                                <td style={{ textAlign: 'right', fontWeight: 700 }}>{item.percentage}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: PROJECTS (SMART COMPACT TABLE - NO HORIZONTAL SCROLL) */}
            {activeTab === 'projects' && (
              <motion.div
                key="tab-projects"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="admin-hero-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span className="admin-section-tag">QUẢN LÝ DỰ ÁN NỘI BỘ</span>
                    <h2 className="admin-hero-title">Khách Hàng & Danh Sách Dự Án</h2>
                    <p className="admin-hero-desc">
                      Hiển thị {filteredProjects.length} / {projects.length} dự án trong danh mục hệ thống
                    </p>
                  </div>

                  <button type="button" className="admin-btn-add" onClick={handleOpenAddModal}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Thêm Dự Án Mới</span>
                  </button>
                </div>

                {/* Toolbar */}
                <div className="admin-toolbar-card">
                  <div className="admin-search-box">
                    <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      className="admin-search-input"
                      placeholder="Tìm kiếm khách hàng, thương hiệu, dịch vụ, người phụ trách..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="admin-filter-row">
                    {stageOptions.length > 0 && (
                      <CustomSelect
                        pill
                        direction="down"
                        value={selectedStage}
                        onChange={(val) => setSelectedStage(val)}
                        options={[
                          { value: 'all', label: 'Tất cả giai đoạn' },
                          ...stageOptions.map((stg) => ({ value: stg, label: stg })),
                        ]}
                      />
                    )}

                    {paymentOptions.length > 0 && (
                      <CustomSelect
                        pill
                        direction="down"
                        value={selectedPayment}
                        onChange={(val) => setSelectedPayment(val)}
                        options={[
                          { value: 'all', label: 'Tất cả thanh toán' },
                          ...paymentOptions.map((pmt) => ({ value: pmt, label: pmt })),
                        ]}
                      />
                    )}

                    {(searchQuery || selectedStage !== 'all' || selectedPayment !== 'all') && (
                      <button
                        type="button"
                        className="admin-pill-btn"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedStage('all');
                          setSelectedPayment('all');
                        }}
                      >
                        <span>Xóa bộ lọc</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* SMART COMPACT TABLE: 5 Columns, No Horizontal Scroll */}
                <div className="admin-table-panel">
                  <table className="admin-compact-table">
                    <thead>
                      <tr>
                        <th style={{ width: '28%' }}>Dự Án & Khách Hàng</th>
                        <th style={{ width: '22%' }}>Dịch Vụ & Phụ Trách</th>
                        <th style={{ width: '20%' }}>Trạng Thái & Tiến Độ</th>
                        <th style={{ width: '15%' }}>Kế Hoạch Thời Gian</th>
                        <th style={{ width: '15%', textAlign: 'right' }}>Giá Trị & Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={5}>
                            <div className="admin-empty-box">
                              {projects.length === 0
                                ? 'Chưa có dữ liệu dự án nào trong hệ thống.'
                                : 'Không tìm thấy kết quả phù hợp với điều kiện tìm kiếm.'}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((p) => {
                          const isPaid = p.paymentStatus?.toLowerCase().includes('đã thanh toán');
                          const stageLower = (p.stage || '').toLowerCase();
                          let stageClass = 'badge-negotiating';
                          if (stageLower.includes('sản xuất') || stageLower.includes('tiền kỳ') || stageLower.includes('hậu kỳ')) {
                            stageClass = 'badge-production';
                          }

                          return (
                            <tr key={p.id}>
                              {/* Cột 1: Mã KH + Tên khách + Thương hiệu */}
                              <td>
                                <div className="admin-cell-stack">
                                  <div className="admin-cell-title-row">
                                    <span className="admin-code-pill">#{p.id}</span>
                                    <span className="admin-cell-main">{p.name}</span>
                                  </div>
                                  <div className="admin-cell-sub">
                                    <span className="admin-brand-tag">🏷️ {p.brand || 'Khách cá nhân'}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Cột 2: Thể loại + Người phụ trách */}
                              <td>
                                <div className="admin-cell-stack">
                                  <div className="admin-cell-service">{p.service}</div>
                                  <div className="admin-cell-sub">
                                    <span className="admin-assignee-chip">
                                      <span className="admin-assignee-avatar">
                                        {(p.assignee || '—')[0].toUpperCase()}
                                      </span>
                                      <span>{p.assignee || 'Chưa phân công'}</span>
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Cột 3: Giai đoạn & Thanh toán */}
                              <td>
                                <div className="admin-badge-stack">
                                  <span className={`admin-badge ${stageClass}`}>
                                    <span className="admin-badge-dot" />
                                    {p.stage}
                                  </span>
                                  <span className={`admin-badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}`}>
                                    <span className="admin-badge-dot" />
                                    {p.paymentStatus}
                                  </span>
                                </div>
                              </td>

                              {/* Cột 4: Kế hoạch thời gian */}
                              <td>
                                <div className="admin-cell-stack admin-cell-dates">
                                  <div className="admin-date-row">
                                    <span className="admin-date-label">Bắt đầu:</span>
                                    <span className="admin-date-val">{p.startDate || '—'}</span>
                                  </div>
                                  <div className="admin-date-row due">
                                    <span className="admin-date-label">Hạn chót:</span>
                                    <span className="admin-date-val">{p.dueDate || '—'}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Cột 5: Giá trị hợp đồng & Nút Thao tác */}
                              <td style={{ textAlign: 'right' }}>
                                <div className="admin-cell-stack" style={{ alignItems: 'flex-end' }}>
                                  <span className="admin-amount-highlight">{p.value}</span>
                                  <div className="admin-action-btns">
                                    <button
                                      type="button"
                                      className="admin-icon-btn edit"
                                      onClick={() => handleOpenEditModal(p)}
                                      title="Chỉnh sửa dự án này"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                      </svg>
                                    </button>

                                    <button
                                      type="button"
                                      className="admin-icon-btn danger"
                                      onClick={() => {
                                        setProjectToDelete(p);
                                        setDeleteConfirmOpen(true);
                                      }}
                                      title="Xóa dự án"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 3: FORM SUBMISSIONS FROM WEBSITE */}
            {activeTab === 'form_submissions' && (
              <motion.div
                key="tab-form-submissions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="admin-hero-heading">
                  <span className="admin-section-tag">WEBSITE LEADS & LIÊN HỆ</span>
                  <h2 className="admin-hero-title">Khách Hàng Đã Điền Form Tư Vấn</h2>
                  <p className="admin-hero-desc">
                    Tổng cộng {filteredSubmissions.length} / {formSubmissions.length} lượt gửi yêu cầu từ website NORE MEDIA
                  </p>
                </div>

                {/* Search Bar */}
                <div className="admin-toolbar-card" style={{ marginBottom: '1.5rem' }}>
                  <div className="admin-search-box" style={{ maxWidth: '480px' }}>
                    <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      className="admin-search-input"
                      placeholder="Tìm kiếm theo Tên, Số điện thoại, Email hoặc Tin nhắn..."
                      value={formSearchQuery}
                      onChange={(e) => setFormSearchQuery(e.target.value)}
                    />
                  </div>

                  {formSearchQuery && (
                    <button
                      type="button"
                      className="admin-pill-btn"
                      onClick={() => setFormSearchQuery('')}
                    >
                      <span>Xóa tìm kiếm</span>
                    </button>
                  )}
                </div>

                {/* Submissions List */}
                {filteredSubmissions.length === 0 ? (
                  <div className="admin-table-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div className="admin-empty-box">
                      {formSubmissions.length === 0
                        ? 'Chưa có thông tin gửi form nào từ website.'
                        : 'Không tìm thấy liên hệ nào phù hợp với từ khóa tìm kiếm.'}
                    </div>
                  </div>
                ) : (
                  <div className="admin-submissions-grid">
                    {filteredSubmissions.map((sub, idx) => {
                      const cleanPhone = (sub.phone || '').replace(/[^\d+]/g, '');
                      return (
                        <div key={sub.id || idx} className="admin-submission-card">
                          <div className="admin-submission-header">
                            <div className="admin-submission-user">
                              <span className="admin-submission-avatar">
                                {(sub.name || 'K')[0].toUpperCase()}
                              </span>
                              <div className="admin-submission-user-info">
                                <span className="admin-submission-name">{sub.name}</span>
                                <span className="admin-submission-source">
                                  <span className="admin-live-dot" />
                                  {sub.source || 'Website Lead'}
                                </span>
                              </div>
                            </div>
                            <span className="admin-submission-time">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span>{formatDateTime(sub.submittedAt)}</span>
                            </span>
                          </div>

                          <div className="admin-submission-contacts">
                            {sub.phone && (
                              <>
                                <a
                                  href={`tel:${cleanPhone}`}
                                  className="admin-contact-link phone"
                                  title="Gọi điện ngay"
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                  </svg>
                                  <span>{sub.phone}</span>
                                </a>
                                <a
                                  href={`https://zalo.me/${cleanPhone.replace('+', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="admin-contact-link zalo"
                                  title="Mở nhắn tin Zalo"
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                  </svg>
                                  <span>Nhắn Zalo</span>
                                </a>
                              </>
                            )}

                            {sub.email && (
                              <a
                                href={`mailto:${sub.email}`}
                                className="admin-contact-link email"
                                title="Gửi email phản hồi"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                  <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <span>{sub.email}</span>
                              </a>
                            )}
                          </div>

                          <div className="admin-submission-msg-box">
                            <span className="admin-msg-tag">Nội dung yêu cầu tư vấn:</span>
                            <p className="admin-msg-content">{sub.message || '—'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* MODAL: ADD / EDIT PROJECT */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => !formSaving && setModalOpen(false)}>
          <motion.div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {modalMode === 'edit' ? `Chỉnh Sửa Dự Án #${formData.id}` : 'Thêm Dự Án Mới'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
                disabled={formSaving}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="admin-modal-body">
                {formError && (
                  <div className="admin-alert-error" style={{ marginBottom: 0 }}>
                    {formError}
                  </div>
                )}

                <div className="admin-modal-grid">
                  <div className="admin-modal-field">
                    <label>Mã KH / Dự Án</label>
                    <input
                      type="text"
                      className="admin-modal-input"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Tên Khách Hàng *</label>
                    <input
                      type="text"
                      className="admin-modal-input"
                      placeholder="VD: Nguyễn Văn A..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-modal-grid">
                  <div className="admin-modal-field">
                    <label>Thương Hiệu</label>
                    <input
                      type="text"
                      className="admin-modal-input"
                      placeholder="VD: Vinamilk, ACTS, Nore..."
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Dịch Vụ / Thể Loại</label>
                    <CustomSelect
                      direction="auto"
                      value={formData.service}
                      onChange={(val) => setFormData({ ...formData, service: val })}
                      options={serviceOptions}
                      allowCustom={true}
                      placeholder="Chọn hoặc nhập thể loại..."
                    />
                  </div>
                </div>

                <div className="admin-modal-grid">
                  <div className="admin-modal-field">
                    <label>Người Phụ Trách</label>
                    <input
                      type="text"
                      className="admin-modal-input"
                      placeholder="VD: Vũ Thành, Đức Thuận..."
                      value={formData.assignee}
                      onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Giá Trị Hợp Đồng</label>
                    <input
                      type="text"
                      className="admin-modal-input"
                      placeholder="VD: 15.000.000 ₫"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-modal-grid">
                  <div className="admin-modal-field">
                    <label>Giai Đoạn Dự Án</label>
                    <CustomSelect
                      direction="up"
                      value={formData.stage}
                      onChange={(val) => setFormData({ ...formData, stage: val })}
                      options={allStageOptions}
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Trạng Thái Thanh Toán</label>
                    <CustomSelect
                      direction="up"
                      value={formData.paymentStatus}
                      onChange={(val) => setFormData({ ...formData, paymentStatus: val })}
                      options={allPaymentOptions}
                    />
                  </div>
                </div>

                <div className="admin-modal-grid">
                  <div className="admin-modal-field">
                    <label>Ngày Bắt Đầu</label>
                    <DatePicker
                      value={formData.startDate}
                      onChange={(val) => setFormData({ ...formData, startDate: val })}
                      placeholder="VD: 10/10/2026"
                      direction="up"
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Hạn Hoàn Thành</label>
                    <DatePicker
                      value={formData.dueDate}
                      onChange={(val) => setFormData({ ...formData, dueDate: val })}
                      placeholder="VD: 25/10/2026"
                      direction="up"
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-pill-btn"
                  onClick={() => setModalOpen(false)}
                  disabled={formSaving}
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  className="admin-btn-add"
                  disabled={formSaving}
                >
                  {formSaving ? 'Đang lưu dữ liệu...' : (modalMode === 'edit' ? 'Lưu Thay Đổi' : 'Thêm Dự Án')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {deleteConfirmOpen && projectToDelete && (
        <div className="admin-modal-backdrop" onClick={() => !deleting && setDeleteConfirmOpen(false)}>
          <motion.div
            className="admin-modal-dialog"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Xác Nhận Xóa Dự Án</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleting}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body" style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.6 }}>
              <p>
                Bạn có chắc chắn muốn xóa dự án <strong>#{projectToDelete.id} — {projectToDelete.name}</strong> không?
              </p>
              <p style={{ color: '#fca5a5', fontSize: '0.82rem', margin: 0 }}>
                ⚠️ Thao tác này sẽ xóa vĩnh viễn thông tin dự án khỏi hệ thống quản lý của NORE MEDIA.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-pill-btn"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleting}
              >
                Hủy
              </button>

              <button
                type="button"
                className="admin-icon-btn danger"
                style={{ width: 'auto', padding: '0.65rem 1.25rem', borderRadius: '999px', fontWeight: 700 }}
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Đang xóa...' : 'Xác Nhận Xóa'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
