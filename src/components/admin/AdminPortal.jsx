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

const PROGRESS_STAGES = [
  'Tiền kỳ',
  'Đang sản xuất',
  'Hậu kỳ',
  'Chỉnh sửa / Feedback',
  'Hoàn thành',
];

const DEFAULT_PROGRESS_MILESTONES = [
  { id: 'm-1', title: 'Họp Kick-off & Moodboard', status: 'completed' },
  { id: 'm-2', title: 'Kịch bản phân cảnh & Storyboard', status: 'in_progress' },
  { id: 'm-3', title: 'Tiền kỳ & Chuẩn bị bối cảnh', status: 'pending' },
  { id: 'm-4', title: 'Sản xuất & Ghi hình on-set', status: 'pending' },
  { id: 'm-5', title: 'Dựng phim, Màu sắc & Âm thanh', status: 'pending' },
  { id: 'm-6', title: 'Duyệt bản Master & Bàn giao', status: 'pending' },
];

export default function AdminPortal({ admin, data, loading, refreshing, onRefresh, onLogout, token }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'projects' | 'form_submissions' | 'project_progress'

  // Search & Filters for Projects
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');

  // Search for Form Submissions
  const [formSearchQuery, setFormSearchQuery] = useState('');

  // Progress Tab States
  const [progressSearchQuery, setProgressSearchQuery] = useState('');
  const [progressSelectedStage, setProgressSelectedStage] = useState('all');
  const [visiblePins, setVisiblePins] = useState(new Set());
  const [copiedPinCode, setCopiedPinCode] = useState(null);

  // Modal State (Add / Edit Project Progress)
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [progressModalMode, setProgressModalMode] = useState('add'); // 'add' | 'edit'
  const [progressFormData, setProgressFormData] = useState({
    id: '',
    projectCode: '',
    pin: '123456',
    projectName: '',
    clientBrand: '',
    service: 'TVC Quảng cáo',
    assignee: '',
    stage: 'Tiền kỳ',
    progress: 25,
    startDate: '',
    dueDate: '',
    milestones: [],
    demoUrl: '',
    finalUrl: '',
    notes: '',
  });
  const [progressSaving, setProgressSaving] = useState(false);
  const [progressFormError, setProgressFormError] = useState('');

  // Delete Confirm for Project Progress
  const [deleteProgressConfirmOpen, setDeleteProgressConfirmOpen] = useState(false);
  const [progressToDelete, setProgressToDelete] = useState(null);
  const [deletingProgress, setDeletingProgress] = useState(false);

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
  const projectProgress = data?.projectProgress || [];

  const togglePinVisibility = (code) => {
    setVisiblePins((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleCopyClientCredentials = (item) => {
    const origin = window.location.origin;
    const text = `NORE MEDIA — THÔNG TIN THEO DÕI TIẾN ĐỘ DỰ ÁN\n` +
      `• Dự án: ${item.projectName}\n` +
      `• Khách hàng / Brand: ${item.clientBrand}\n` +
      `• Đường dẫn đăng nhập: ${origin}/login\n` +
      `• Mã Dự Án: ${item.projectCode}\n` +
      `• Mã PIN: ${item.pin}\n\n` +
      `Quý khách truy cập liên kết trên và nhập Mã Dự Án cùng Mã PIN để xem tiến độ cập nhật mới nhất từ studio.`;
    navigator.clipboard.writeText(text);
    setCopiedPinCode(item.projectCode);
    setTimeout(() => {
      setCopiedPinCode((prev) => (prev === item.projectCode ? null : prev));
    }, 2500);
    showToast(`Đã sao chép thông tin gửi khách (${item.projectCode})!`);
  };

  const getStageBadgeClass = (stage) => {
    const s = (stage || '').toLowerCase();
    if (s.includes('hoàn thành')) return 'badge-paid';
    if (s.includes('sản xuất') || s.includes('hậu kỳ') || s.includes('tiền kỳ')) return 'badge-production';
    return 'badge-negotiating';
  };

  const progressStageFilterOptions = useMemo(() => [
    { value: 'all', label: `Tất cả giai đoạn (${projectProgress.length})` },
    ...PROGRESS_STAGES.map((s) => ({ value: s, label: s })),
  ], [projectProgress.length]);

  const projectQuickOptions = useMemo(() => [
    { value: '', label: '-- Chọn dự án để tự động điền thông tin --' },
    ...projects.map((p) => ({
      value: p.id,
      label: `#${p.id} - ${p.name} (${p.brand && p.brand !== '—' ? p.brand : 'Khách'}) • ${p.service}`,
    })),
  ], [projects]);

  // Filter Project Progress
  const filteredProgress = useMemo(() => {
    return projectProgress.filter((p) => {
      const q = progressSearchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.projectName.toLowerCase().includes(q) ||
        p.clientBrand.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.assignee.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q);

      const matchStage = progressSelectedStage === 'all' || p.stage === progressSelectedStage;
      return matchQuery && matchStage;
    });
  }, [projectProgress, progressSearchQuery, progressSelectedStage]);

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

  // Progress Handlers
  const handleOpenAddProgressModal = () => {
    const existingCodes = projectProgress.map((p) => p.projectCode);
    let maxNum = 0;
    for (const code of existingCodes) {
      const match = code.match(/(\d+)$/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    const nextCode = `NR-${String(maxNum + 1).padStart(3, '0')}`;

    setProgressFormData({
      id: nextCode,
      projectCode: nextCode,
      pin: '123456',
      projectName: '',
      clientBrand: '',
      service: serviceOptions[0] || 'TVC Quảng cáo',
      assignee: '',
      stage: 'Tiền kỳ',
      progress: 25,
      startDate: new Date().toLocaleDateString('vi-VN'),
      dueDate: '',
      milestones: [...DEFAULT_PROGRESS_MILESTONES],
      demoUrl: '',
      finalUrl: '',
      notes: '',
    });
    setProgressFormError('');
    setProgressModalMode('add');
    setProgressModalOpen(true);
  };

  const handleOpenEditProgressModal = (item) => {
    setProgressFormData({
      id: item.projectCode,
      projectCode: item.projectCode,
      pin: item.pin || '123456',
      projectName: item.projectName,
      clientBrand: item.clientBrand === '—' ? '' : item.clientBrand,
      service: item.service === '—' ? '' : item.service,
      assignee: item.assignee === '—' ? '' : item.assignee,
      stage: item.stage || 'Tiền kỳ',
      progress: item.progress || 0,
      startDate: item.startDate === '—' ? '' : item.startDate,
      dueDate: item.dueDate === '—' ? '' : item.dueDate,
      milestones: Array.isArray(item.milestones) ? JSON.parse(JSON.stringify(item.milestones)) : [...DEFAULT_PROGRESS_MILESTONES],
      demoUrl: item.demoUrl || '',
      finalUrl: item.finalUrl || '',
      notes: item.notes || '',
    });
    setProgressFormError('');
    setProgressModalMode('edit');
    setProgressModalOpen(true);
  };

  const handleQuickPickFromProjects = (projectId) => {
    if (!projectId) return;
    const found = projects.find((p) => String(p.id).trim() === String(projectId).trim());
    if (found) {
      setProgressFormData((prev) => ({
        ...prev,
        projectName: found.name !== 'Chưa đặt tên' ? found.name : prev.projectName,
        clientBrand: found.brand !== '—' ? found.brand : prev.clientBrand,
        service: found.service !== '—' ? found.service : prev.service,
        assignee: found.assignee !== '—' ? found.assignee : prev.assignee,
        startDate: found.startDate !== '—' ? found.startDate : prev.startDate,
        dueDate: found.dueDate !== '—' ? found.dueDate : prev.dueDate,
      }));
    }
  };

  const handleAutoCalcProgressFromMilestones = () => {
    const ms = progressFormData.milestones || [];
    if (ms.length === 0) return;
    const completed = ms.filter((m) => m.status === 'completed').length;
    const calculated = Math.round((completed / ms.length) * 100);
    setProgressFormData((prev) => ({ ...prev, progress: calculated }));
  };

  const handleModalAddMilestone = () => {
    setProgressFormData((prev) => ({
      ...prev,
      milestones: [
        ...(prev.milestones || []),
        { id: `m-${Date.now()}`, title: '', status: 'pending' },
      ],
    }));
  };

  const handleModalRemoveMilestone = (index) => {
    setProgressFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  const handleModalMilestoneChange = (index, field, value) => {
    setProgressFormData((prev) => {
      const nextMilestones = [...prev.milestones];
      nextMilestones[index] = { ...nextMilestones[index], [field]: value };
      return { ...prev, milestones: nextMilestones };
    });
  };

  const handleSaveProgress = async (e) => {
    e.preventDefault();
    if (!progressFormData.projectName.trim()) {
      setProgressFormError('Vui lòng nhập Tên dự án.');
      return;
    }

    setProgressSaving(true);
    setProgressFormError('');

    try {
      const isEdit = progressModalMode === 'edit';
      const endpoint = isEdit
        ? `/api/admin/progress/${encodeURIComponent(progressFormData.projectCode)}`
        : '/api/admin/progress';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(progressFormData),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Thao tác không thành công.');
      }

      setProgressModalOpen(false);
      showToast(isEdit ? 'Đã cập nhật tiến độ dự án!' : 'Đã thêm tiến độ dự án mới!');
      onRefresh();
    } catch (err) {
      setProgressFormError(err.message || 'Lỗi khi lưu dữ liệu tiến độ.');
    } finally {
      setProgressSaving(false);
    }
  };

  const handleDeleteProgressConfirm = async () => {
    if (!progressToDelete) return;
    setDeletingProgress(true);

    try {
      const res = await fetch(`/api/admin/progress/${encodeURIComponent(progressToDelete.projectCode)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Không thể xóa tiến độ dự án.');
      }

      setDeleteProgressConfirmOpen(false);
      setProgressToDelete(null);
      showToast('Đã xóa tiến độ dự án thành công!');
      onRefresh();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa tiến độ dự án.');
    } finally {
      setDeletingProgress(false);
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
              <span>Khách Hàng mới</span>
              <span className="admin-tab-count">{formSubmissions.length}</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'project_progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('project_progress')}
              role="tab"
              aria-selected={activeTab === 'project_progress'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span>Tiến độ dự án</span>
              <span className="admin-tab-count">{projectProgress.length}</span>
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
                  <h2 className="admin-hero-title">Khách Hàng Đã Đăng Ký Tư Vấn</h2>
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

            {/* TAB 4: PROJECT PROGRESS */}
            {activeTab === 'project_progress' && (
              <motion.div
                key="tab-project-progress"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {/* Hero Heading */}
                <div className="admin-hero-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span className="admin-section-tag">TIẾN ĐỘ & CỔNG KHÁCH HÀNG</span>
                    <h2 className="admin-hero-title">Quản Lý Tiến Độ Dự Án</h2>
                    <p className="admin-hero-desc">
                      Cập nhật giai đoạn, mốc công việc (milestones), link demo và tài khoản đăng nhập (Mã Dự Án & PIN) cho khách hàng
                    </p>
                  </div>

                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleOpenAddProgressModal}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Thêm Tiến Độ Dự Án</span>
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
                      placeholder="Tìm theo Mã dự án, Tên dự án, Khách hàng, Phụ trách..."
                      value={progressSearchQuery}
                      onChange={(e) => setProgressSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="admin-filter-group">
                    <CustomSelect
                      value={progressSelectedStage}
                      onChange={(val) => setProgressSelectedStage(val)}
                      options={progressStageFilterOptions}
                      placeholder="Tất cả giai đoạn"
                    />
                    {(progressSearchQuery || progressSelectedStage !== 'all') && (
                      <button
                        type="button"
                        className="admin-pill-btn"
                        onClick={() => {
                          setProgressSearchQuery('');
                          setProgressSelectedStage('all');
                        }}
                      >
                        <span>Xóa bộ lọc</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Table: 5-Column Compact Smart Table */}
                <div className="admin-table-panel">
                  <table className="admin-compact-table">
                    <thead>
                      <tr>
                        <th style={{ width: '28%' }}>Dự Án & Khách Hàng</th>
                        <th style={{ width: '20%' }}>Mã PIN & Truy Cập</th>
                        <th style={{ width: '22%' }}>Giai Đoạn & Tiến Độ</th>
                        <th style={{ width: '20%' }}>Tài Liệu & Ghi Chú</th>
                        <th style={{ width: '10%', textAlign: 'right' }}>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProgress.length === 0 ? (
                        <tr>
                          <td colSpan={5}>
                            <div className="admin-empty-box">
                              {projectProgress.length === 0
                                ? 'Chưa có dự án nào trong bảng Tiến Độ.'
                                : 'Không tìm thấy kết quả phù hợp với điều kiện tìm kiếm.'}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredProgress.map((item) => {
                          const isPinShown = visiblePins.has(item.projectCode);
                          return (
                            <tr key={item.projectCode}>
                              {/* Cột 1: Mã dự án + Tên + Khách/Brand + Dịch vụ */}
                              <td>
                                <div className="admin-cell-stack">
                                  <div className="admin-cell-title-row">
                                    <span className="admin-code-pill">{item.projectCode}</span>
                                    <span className="admin-cell-main">{item.projectName}</span>
                                  </div>
                                  <div className="admin-cell-sub">
                                    <span className="admin-brand-tag">🏷️ {item.clientBrand || 'Khách cá nhân'}</span>
                                    {item.service && (
                                      <span className="admin-assignee-chip" style={{ marginLeft: '0.4rem' }}>
                                        <span>{item.service}</span>
                                      </span>
                                    )}
                                    {item.assignee && (
                                      <span className="admin-assignee-chip" style={{ marginLeft: '0.4rem' }}>
                                        <span className="admin-assignee-avatar">
                                          {item.assignee[0].toUpperCase()}
                                        </span>
                                        <span>{item.assignee}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Cột 2: Mã PIN & Truy Cập */}
                              <td>
                                <div className="admin-cell-stack">
                                  <div className="admin-pin-chip">
                                    <span style={{ color: '#94a3b8', fontSize: '0.74rem' }}>PIN:</span>
                                    <span style={{ fontWeight: 700, letterSpacing: isPinShown ? '0.08em' : '0.15em', color: '#00e5ff' }}>
                                      {isPinShown ? item.pin : '••••••'}
                                    </span>
                                    <button
                                      type="button"
                                      className="admin-pin-toggle-btn"
                                      onClick={() => togglePinVisibility(item.projectCode)}
                                      title={isPinShown ? 'Ẩn mã PIN' : 'Hiện mã PIN'}
                                    >
                                      {isPinShown ? (
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                          <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                      ) : (
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                          <circle cx="12" cy="12" r="3" />
                                        </svg>
                                      )}
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      className={`admin-copy-creds-btn ${copiedPinCode === item.projectCode ? 'is-copied' : ''}`}
                                      onClick={() => handleCopyClientCredentials(item)}
                                      title="Sao chép toàn bộ thông tin đăng nhập gửi cho khách"
                                    >
                                      {copiedPinCode === item.projectCode ? (
                                        <>
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                          <span>Đã chép!</span>
                                        </>
                                      ) : (
                                        <>
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                          </svg>
                                          <span>Gửi khách</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Cột 3: Giai Đoạn & Tiến Độ */}
                              <td>
                                <div className="admin-cell-stack">
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                                    <span className={`admin-badge ${getStageBadgeClass(item.stage)}`}>
                                      <span className="admin-badge-dot" />
                                      {item.stage}
                                    </span>
                                    <span className="admin-milestone-chip">
                                      ✓ {(item.milestones || []).filter((m) => m.status === 'completed').length}/{(item.milestones || []).length} mốc
                                    </span>
                                  </div>
                                  <div className="admin-progress-meter-wrap" style={{ marginTop: '0.4rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '0.2rem' }}>
                                      <span style={{ color: '#94a3b8' }}>Tiến độ:</span>
                                      <span style={{ color: '#00e5ff', fontWeight: 700 }}>{item.progress}%</span>
                                    </div>
                                    <div className="admin-progress-meter-track">
                                      <div
                                        className="admin-progress-meter-fill"
                                        style={{ width: `${Math.min(100, Math.max(0, Number(item.progress) || 0))}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Cột 4: Tài Liệu & Ghi Chú */}
                              <td>
                                <div className="admin-cell-stack">
                                  <div className="admin-links-cell">
                                    {item.demoUrl ? (
                                      <a
                                        href={item.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="admin-link-pill demo"
                                        title={item.demoUrl}
                                      >
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                          <polyline points="15 3 21 3 21 9" />
                                          <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                        <span>Demo</span>
                                      </a>
                                    ) : null}
                                    {item.finalUrl ? (
                                      <a
                                        href={item.finalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="admin-link-pill final"
                                        title={item.finalUrl}
                                      >
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                          <polyline points="7 10 12 15 17 10" />
                                          <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        <span>Final</span>
                                      </a>
                                    ) : null}
                                    {!item.demoUrl && !item.finalUrl && (
                                      <span className="admin-empty-link">Chưa cập nhật link</span>
                                    )}
                                  </div>

                                  {item.notes ? (
                                    <div className="admin-progress-notes" title={item.notes}>
                                      "{item.notes}"
                                    </div>
                                  ) : null}

                                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                                    {item.startDate || item.dueDate ? (
                                      <span>{item.startDate || '—'} → {item.dueDate || '—'}</span>
                                    ) : (
                                      <span>Chưa đặt hạn</span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Cột 5: Thao Tác */}
                              <td style={{ textAlign: 'right' }}>
                                <div className="admin-cell-stack" style={{ alignItems: 'flex-end' }}>
                                  <div className="admin-action-btns">
                                    <button
                                      type="button"
                                      className="admin-icon-btn edit"
                                      onClick={() => handleOpenEditProgressModal(item)}
                                      title="Chỉnh sửa tiến độ"
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
                                        setProgressToDelete(item);
                                        setDeleteProgressConfirmOpen(true);
                                      }}
                                      title="Xóa tiến độ"
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

      {/* MODAL: ADD / EDIT PROJECT PROGRESS */}
      {progressModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => !progressSaving && setProgressModalOpen(false)}>
          <motion.div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ maxWidth: '640px' }}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {progressModalMode === 'edit'
                  ? `Chỉnh Sửa Tiến Độ Dự Án #${progressFormData.projectCode}`
                  : 'Thêm Tiến Độ Dự Án Mới'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setProgressModalOpen(false)}
                disabled={progressSaving}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProgress} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="admin-modal-body">
                {progressFormError && (
                  <div className="admin-alert-error" style={{ marginBottom: 0 }}>
                    {progressFormError}
                  </div>
                )}

                {/* Quick Autofill from existing Projects */}
                {progressModalMode === 'add' && projects.length > 0 && (
                  <div style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px dashed rgba(0, 229, 255, 0.25)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00e5ff', display: 'block', marginBottom: '0.35rem' }}>
                      ⚡ Chọn nhanh từ danh sách Dự án có sẵn:
                    </label>
                    <CustomSelect
                      value=""
                      onChange={(val) => handleQuickPickFromProjects(val)}
                      options={projectQuickOptions}
                      placeholder="-- Chọn dự án để tự động điền thông tin --"
                    />
                  </div>
                )}

                <div className="admin-modal-grid">
                  <div className="admin-modal-field">
                    <label>Mã Dự Án (Cấp cho khách) *</label>
                    <input
                      type="text"
                      className="admin-modal-input"
                      value={progressFormData.projectCode}
                      onChange={(e) => setProgressFormData({ ...progressFormData, projectCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Mã PIN Khách Hàng (6 số) *</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <input
                        type="text"
                        className="admin-modal-input"
                        value={progressFormData.pin}
                        onChange={(e) => setProgressFormData({ ...progressFormData, pin: e.target.value })}
                        required
                        maxLength={10}
                      />
                      <button
                        type="button"
                        className="admin-pill-btn"
                        onClick={() => {
                          const randPin = String(Math.floor(100000 + Math.random() * 900000));
                          setProgressFormData({ ...progressFormData, pin: randPin });
                        }}
                        style={{ whiteSpace: 'nowrap' }}
                        title="Tạo mã PIN 6 số ngẫu nhiên"
                      >
                        PIN mới
                      </button>
                    </div>
                  </div>

                  <div className="admin-modal-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Tên Dự Án *</label>
                    <input
                      type="text"
                      className="admin-modal-input"
                      placeholder="VD: TVC ACTS Summer Collection..."
                      value={progressFormData.projectName}
                      onChange={(e) => setProgressFormData({ ...progressFormData, projectName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Khách Hàng / Thương Hiệu</label>
                    <input
                      type="text"
                      className="admin-modal-input"
                      placeholder="VD: Trân Trân / ACTS..."
                      value={progressFormData.clientBrand}
                      onChange={(e) => setProgressFormData({ ...progressFormData, clientBrand: e.target.value })}
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Dịch Vụ Sản Xuất</label>
                    <CustomSelect
                      direction="up"
                      value={progressFormData.service}
                      onChange={(val) => setProgressFormData({ ...progressFormData, service: val })}
                      options={serviceOptions}
                      allowCustom={true}
                      placeholder="Chọn hoặc nhập dịch vụ..."
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Người Phụ Trách</label>
                    <input
                      type="text"
                      className="admin-modal-input"
                      placeholder="VD: Vũ Thành..."
                      value={progressFormData.assignee}
                      onChange={(e) => setProgressFormData({ ...progressFormData, assignee: e.target.value })}
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Giai Đoạn Hiện Tại</label>
                    <CustomSelect
                      direction="up"
                      value={progressFormData.stage}
                      onChange={(val) => setProgressFormData({ ...progressFormData, stage: val })}
                      options={PROGRESS_STAGES}
                    />
                  </div>

                  {/* Progress Slider */}
                  <div className="admin-modal-field" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ margin: 0 }}>
                        Tiến Độ Thực Tế: <strong style={{ color: '#00e5ff' }}>{progressFormData.progress}%</strong>
                      </label>
                      <button
                        type="button"
                        className="admin-autocalc-btn"
                        onClick={handleAutoCalcProgressFromMilestones}
                        title="Tự động tính phần trăm dựa trên số mốc công việc đã hoàn thành"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        <span>Tự tính theo mốc</span>
                      </button>
                    </div>
                    <div className="admin-slider-group">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        className="admin-slider-range"
                        value={progressFormData.progress}
                        onChange={(e) => setProgressFormData({ ...progressFormData, progress: Number(e.target.value) })}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="admin-modal-input admin-slider-input"
                        value={progressFormData.progress}
                        onChange={(e) => setProgressFormData({ ...progressFormData, progress: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
                      />
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>%</span>
                    </div>
                    <div className="admin-preset-pills-row">
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginRight: '0.2rem' }}>Mức nhanh:</span>
                      {[0, 25, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          className={`admin-preset-pill ${Number(progressFormData.progress) === pct ? 'active' : ''}`}
                          onClick={() => setProgressFormData({ ...progressFormData, progress: pct })}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="admin-modal-field">
                    <label>Ngày Bắt Đầu</label>
                    <DatePicker
                      value={progressFormData.startDate}
                      onChange={(val) => setProgressFormData({ ...progressFormData, startDate: val })}
                      placeholder="VD: 10/10/2026"
                      direction="up"
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Hạn Hoàn Thành</label>
                    <DatePicker
                      value={progressFormData.dueDate}
                      onChange={(val) => setProgressFormData({ ...progressFormData, dueDate: val })}
                      placeholder="VD: 25/10/2026"
                      direction="up"
                    />
                  </div>

                  {/* Milestones Builder */}
                  <div className="admin-modal-field" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Các Mốc Công Việc ({progressFormData.milestones?.length || 0})</span>
                      <button
                        type="button"
                        className="admin-pill-btn"
                        onClick={() => setProgressFormData({ ...progressFormData, milestones: [...DEFAULT_PROGRESS_MILESTONES] })}
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                      >
                        Tạo 6 mốc chuẩn
                      </button>
                    </label>

                    <div className="admin-milestone-editor">
                      {(progressFormData.milestones || []).map((m, idx) => (
                        <div key={m.id || idx} className="admin-milestone-row">
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: '18px', textAlign: 'center', flexShrink: 0 }}>
                            {idx + 1}.
                          </span>
                          <input
                            type="text"
                            className="admin-milestone-input"
                            placeholder="Tên mốc công việc..."
                            value={m.title}
                            onChange={(e) => handleModalMilestoneChange(idx, 'title', e.target.value)}
                          />
                          <div className="admin-milestone-status-segmented">
                            <button
                              type="button"
                              className={`admin-status-seg-btn pending ${m.status === 'pending' ? 'active' : ''}`}
                              onClick={() => handleModalMilestoneChange(idx, 'status', 'pending')}
                              title="Chờ xử lý"
                            >
                              <span className="seg-dot" />
                              <span>Chờ</span>
                            </button>
                            <button
                              type="button"
                              className={`admin-status-seg-btn in_progress ${m.status === 'in_progress' ? 'active' : ''}`}
                              onClick={() => handleModalMilestoneChange(idx, 'status', 'in_progress')}
                              title="Đang làm"
                            >
                              <span className="seg-dot" />
                              <span>Làm</span>
                            </button>
                            <button
                              type="button"
                              className={`admin-status-seg-btn completed ${m.status === 'completed' ? 'active' : ''}`}
                              onClick={() => handleModalMilestoneChange(idx, 'status', 'completed')}
                              title="Hoàn thành"
                            >
                              <span className="seg-dot" />
                              <span>Xong</span>
                            </button>
                          </div>
                          <button
                            type="button"
                            className="admin-milestone-del-btn"
                            onClick={() => handleModalRemoveMilestone(idx)}
                            title="Xóa mốc này"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <div className="admin-milestone-actions-row">
                        <button
                          type="button"
                          className="admin-milestone-add-btn"
                          onClick={handleModalAddMilestone}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          <span>Thêm mốc công việc</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="admin-modal-field">
                    <label>Link Demo / Bản Nháp</label>
                    <input
                      type="url"
                      className="admin-modal-input"
                      placeholder="https://..."
                      value={progressFormData.demoUrl}
                      onChange={(e) => setProgressFormData({ ...progressFormData, demoUrl: e.target.value })}
                    />
                  </div>

                  <div className="admin-modal-field">
                    <label>Link Bàn Giao Final (File Master)</label>
                    <input
                      type="url"
                      className="admin-modal-input"
                      placeholder="https://drive.google.com/..."
                      value={progressFormData.finalUrl}
                      onChange={(e) => setProgressFormData({ ...progressFormData, finalUrl: e.target.value })}
                    />
                  </div>

                  <div className="admin-modal-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Ghi Chú Cập Nhật (Khách sẽ đọc được ghi chú này)</label>
                    <textarea
                      className="admin-modal-input"
                      rows={2}
                      placeholder="VD: Đã chốt concept, đang hoàn thiện storyboard và chuẩn bị casting..."
                      value={progressFormData.notes}
                      onChange={(e) => setProgressFormData({ ...progressFormData, notes: e.target.value })}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-pill-btn"
                  onClick={() => setProgressModalOpen(false)}
                  disabled={progressSaving}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="admin-btn-add"
                  disabled={progressSaving}
                >
                  {progressSaving ? 'Đang lưu vào Sheet...' : (progressModalMode === 'edit' ? 'Lưu Thay Đổi' : 'Thêm Tiến Độ')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL FOR PROGRESS */}
      {deleteProgressConfirmOpen && progressToDelete && (
        <div className="admin-modal-backdrop" onClick={() => !deletingProgress && setDeleteProgressConfirmOpen(false)}>
          <motion.div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ maxWidth: '440px' }}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title" style={{ color: '#f87171' }}>
                Xác Nhận Xóa Tiến Độ
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setDeleteProgressConfirmOpen(false)}
                disabled={deletingProgress}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <p style={{ color: '#e2e8f0', lineHeight: 1.5 }}>
                Bạn có chắc chắn muốn xóa tiến độ của dự án <strong>{progressToDelete.projectName}</strong> (Mã: <code>{progressToDelete.projectCode}</code>)?
              </p>
              <p style={{ color: '#fca5a5', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Khách hàng sẽ không thể đăng nhập tra cứu tiến độ với mã này nữa.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setDeleteProgressConfirmOpen(false)}
                disabled={deletingProgress}
              >
                Hủy
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleDeleteProgressConfirm}
                disabled={deletingProgress}
                style={{ background: '#ef4444', borderColor: '#ef4444', color: '#ffffff' }}
              >
                {deletingProgress ? 'Đang xóa...' : 'Xác Nhận Xóa'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
