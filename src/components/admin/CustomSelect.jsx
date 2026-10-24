import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS = {
  // Payment Statuses
  'Đã thanh toán 100%': '#10b981',
  'Đã đặt cọc 50%': '#f59e0b',
  'Chưa thanh toán': '#f43f5e',

  // Project Stages
  'Hoàn thành': '#10b981',
  'Hậu kỳ': '#a855f7',
  'Đang sản xuất': '#06b6d4',
  'Tiền kỳ': '#3b82f6',
  'Đang đàm phán': '#f59e0b',
  'Đề xuất / Pitching': '#ec4899',

  // Filters
  all: '#94a3b8',
};

function getStatusColor(val) {
  if (!val) return null;
  if (STATUS_COLORS[val]) return STATUS_COLORS[val];
  const lower = String(val).toLowerCase();
  if (lower.includes('100%') || lower.includes('hoàn thành')) return '#10b981';
  if (lower.includes('50%') || lower.includes('đàm phán')) return '#f59e0b';
  if (lower.includes('chưa')) return '#f43f5e';
  if (lower.includes('sản xuất')) return '#06b6d4';
  if (lower.includes('tiền kỳ')) return '#3b82f6';
  if (lower.includes('hậu kỳ')) return '#a855f7';
  if (lower.includes('pitching') || lower.includes('đề xuất')) return '#ec4899';
  if (lower.includes('tvc') || lower.includes('quảng cáo')) return '#38bdf8';
  if (lower.includes('viral')) return '#a855f7';
  if (lower.includes('photo') || lower.includes('chụp')) return '#f59e0b';
  if (lower.includes('mv') || lower.includes('ca nhạc')) return '#ec4899';
  if (lower.includes('corporate') || lower.includes('doanh nghiệp')) return '#14b8a6';
  if (lower.includes('3d') || lower.includes('vfx') || lower.includes('animation')) return '#6366f1';
  if (lower.includes('livestream') || lower.includes('event')) return '#e11d48';
  return '#94a3b8';
}

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Chọn một mục...',
  pill = false,
  direction = 'auto',
  className = '',
  disabled = false,
  allowCustom = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(direction === 'up');
  const [alignRight, setAlignRight] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to [{ value, label }]
  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value,
          label: opt.label || opt.value,
          color: opt.color || getStatusColor(opt.value),
        };
      }
      return {
        value: opt,
        label: opt,
        color: getStatusColor(opt),
      };
    });
  }, [options]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : (value || placeholder);
  const currentColor = selectedOption ? selectedOption.color : (value ? getStatusColor(value) : null);

  // Filter options when user searches in custom mode
  const filteredOptions = useMemo(() => {
    if (!allowCustom || !searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter((opt) =>
      String(opt.label).toLowerCase().includes(q)
    );
  }, [normalizedOptions, searchQuery, allowCustom]);

  const isExactMatch = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.some((opt) => String(opt.value).toLowerCase() === q);
  }, [normalizedOptions, searchQuery]);

  // Toggle open and calculate flip direction
  const handleToggle = useCallback(() => {
    if (disabled) return;
    if (!isOpen && triggerRef.current) {
      setSearchQuery('');
      const rect = triggerRef.current.getBoundingClientRect();
      if (rect.left + 240 > window.innerWidth) {
        setAlignRight(true);
      } else {
        setAlignRight(false);
      }

      if (direction === 'up') {
        setOpenUpwards(true);
      } else if (direction === 'down') {
        setOpenUpwards(false);
      } else {
        // Container-aware detection: check closest scroll container (e.g. .admin-modal-body)
        const scrollParent = triggerRef.current.closest('.admin-modal-body') || null;
        if (scrollParent) {
          const parentRect = scrollParent.getBoundingClientRect();
          const spaceBelow = parentRect.bottom - rect.bottom;
          if (spaceBelow < 220) {
            setOpenUpwards(true);
          } else {
            setOpenUpwards(false);
          }
        } else {
          const spaceBelow = window.innerHeight - rect.bottom;
          if (spaceBelow < 240 && rect.top > 240) {
            setOpenUpwards(true);
          } else {
            setOpenUpwards(false);
          }
        }
      }

      if (allowCustom) {
        setTimeout(() => searchInputRef.current?.focus(), 60);
      }
    }
    setIsOpen((prev) => !prev);
  }, [disabled, isOpen, direction, allowCustom]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange?.(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`admin-custom-select-wrapper ${pill ? 'pill-mode' : 'modal-mode'} ${isOpen ? 'is-open' : ''} ${className}`}
      style={{ position: 'relative', zIndex: isOpen ? 50 : 1 }}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        className={`admin-custom-select-trigger ${pill ? 'admin-select-pill' : 'admin-modal-select'}`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="admin-custom-select-trigger-content">
          {currentColor && (
            <span
              className="admin-custom-select-dot"
              style={{
                backgroundColor: currentColor,
                boxShadow: `0 0 10px ${currentColor}aa, 0 0 2px ${currentColor}`,
              }}
            />
          )}
          <span className="admin-custom-select-text">{displayLabel}</span>
        </span>

        <svg
          className={`admin-custom-select-chevron ${isOpen ? 'rotated' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`admin-custom-select-dropdown ${openUpwards ? 'open-up' : 'open-down'} ${alignRight ? 'align-right' : ''}`}
            initial={{ opacity: 0, y: openUpwards ? 8 : -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpwards ? 6 : -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
          >
            {allowCustom && (
              <div className="admin-custom-select-search-wrap">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="admin-custom-select-search-input"
                  placeholder="Tìm hoặc nhập thể loại mới..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        handleSelect(searchQuery.trim());
                      }
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="admin-custom-select-clear-btn"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    title="Xóa tìm kiếm"
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {allowCustom && searchQuery.trim() && !isExactMatch && (
              <button
                type="button"
                className="admin-custom-select-add-custom-btn"
                onClick={() => handleSelect(searchQuery.trim())}
              >
                <span className="admin-add-custom-icon">＋</span>
                <span>
                  Sử dụng thể loại mới: <strong>"{searchQuery.trim()}"</strong>
                </span>
              </button>
            )}

            <div className="admin-custom-select-options-list">
              {filteredOptions.length === 0 && (
                <div className="admin-custom-select-empty">
                  <span>Không tìm thấy thể loại có sẵn trùng khớp.</span>
                </div>
              )}

              {filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    className={`admin-custom-select-option ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="admin-custom-select-option-content">
                      {opt.color && (
                        <span
                          className="admin-custom-select-dot"
                          style={{
                            backgroundColor: opt.color,
                            boxShadow: isSelected
                              ? `0 0 10px ${opt.color}cc, 0 0 3px ${opt.color}`
                              : `0 0 6px ${opt.color}66`,
                          }}
                        />
                      )}
                      <span className="admin-custom-select-option-label">{opt.label}</span>
                    </div>

                    {isSelected && (
                      <span className="admin-custom-select-check">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
