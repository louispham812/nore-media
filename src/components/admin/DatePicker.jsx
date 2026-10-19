import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MONTH_NAMES = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

const DAY_NAMES = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function parseDate(str) {
  if (!str || typeof str !== 'string') return null;
  const s = str.trim();
  if (!s || s === '—' || s === '-') return null;

  // DD/MM/YYYY
  if (s.includes('/')) {
    const parts = s.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y) && d >= 1 && d <= 31) {
        return new Date(y, m, d);
      }
    }
  }

  // YYYY-MM-DD
  if (s.includes('-')) {
    const parts = s.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y) && d >= 1 && d <= 31) {
        return new Date(y, m, d);
      }
    }
  }

  const parsed = new Date(s);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

export default function DatePicker({
  value = '',
  onChange,
  placeholder = 'VD: 15/10/2026',
  direction = 'up',
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const initialDate = useMemo(() => parseDate(value) || new Date(), [value]);
  const [viewYear, setViewYear] = useState(() => initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => initialDate.getMonth());

  // Update view when value changes and popover opens
  useEffect(() => {
    if (isOpen) {
      const d = parseDate(value) || new Date();
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [isOpen, value]);

  // Click outside to close
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

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (dayObj) => {
    const selected = new Date(dayObj.year, dayObj.month, dayObj.day);
    onChange?.(formatDate(selected));
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    onChange?.(formatDate(today));
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange?.('');
    setIsOpen(false);
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const daysInCurrent = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const startOffset = (firstDay + 6) % 7; // Monday = 0

    const days = [];

    // Prev month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        day: daysInPrev - i,
        month: viewMonth - 1,
        year: viewMonth === 0 ? viewYear - 1 : viewYear,
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let i = 1; i <= daysInCurrent; i++) {
      days.push({
        day: i,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
      });
    }

    // Next month padding
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: viewMonth + 1,
        year: viewMonth === 11 ? viewYear + 1 : viewYear,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const selectedDateObj = useMemo(() => parseDate(value), [value]);
  const todayObj = useMemo(() => new Date(), []);

  return (
    <div
      ref={containerRef}
      className={`admin-datepicker-wrapper ${className}`}
      style={{ position: 'relative', zIndex: isOpen ? 60 : 1 }}
    >
      {/* Trigger Input with Calendar Icon */}
      <div className="admin-datepicker-trigger-wrap">
        <input
          type="text"
          className="admin-modal-input admin-datepicker-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
        />

        {value && !disabled && (
          <button
            type="button"
            className="admin-datepicker-clear-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            title="Xóa ngày đã chọn"
          >
            ✕
          </button>
        )}

        <button
          type="button"
          className="admin-datepicker-cal-btn"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          title="Mở lịch chọn ngày"
          disabled={disabled}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      {/* Calendar Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`admin-datepicker-popover ${direction === 'up' ? 'open-up' : 'open-down'}`}
            initial={{ opacity: 0, y: direction === 'up' ? 8 : -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'up' ? 6 : -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Calendar Header */}
            <div className="admin-calendar-header">
              <span className="admin-calendar-title">
                {MONTH_NAMES[viewMonth]} / {viewYear}
              </span>

              <div className="admin-calendar-nav-btns">
                <button
                  type="button"
                  className="admin-calendar-nav-btn"
                  onClick={handlePrevMonth}
                  title="Tháng trước"
                >
                  ◀
                </button>
                <button
                  type="button"
                  className="admin-calendar-nav-btn"
                  onClick={handleNextMonth}
                  title="Tháng sau"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="admin-calendar-weekdays">
              {DAY_NAMES.map((d) => (
                <span key={d} className="admin-calendar-weekday">
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="admin-calendar-grid">
              {calendarDays.map((dObj, idx) => {
                const cellDate = new Date(dObj.year, dObj.month, dObj.day);
                const isSelected = selectedDateObj && isSameDay(cellDate, selectedDateObj);
                const isToday = isSameDay(cellDate, todayObj);

                return (
                  <button
                    key={`${dObj.year}-${dObj.month}-${dObj.day}-${idx}`}
                    type="button"
                    className={`admin-calendar-day ${!dObj.isCurrentMonth ? 'other-month' : ''} ${
                      isToday ? 'today' : ''
                    } ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectDay(dObj)}
                  >
                    {dObj.day}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="admin-calendar-footer">
              <button
                type="button"
                className="admin-calendar-quick-btn"
                onClick={handleSelectToday}
              >
                Hôm nay
              </button>

              <button
                type="button"
                className="admin-calendar-quick-btn"
                onClick={handleClear}
                style={{ color: '#f87171' }}
              >
                Xóa ngày
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
