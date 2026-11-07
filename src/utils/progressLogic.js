/**
 * Core business & display logic for NORE MEDIA Client Progress and Admin Management
 */

export const STAGES_SEQUENCE = [
  { id: 'tien-ky', label: 'Tiền kỳ', icon: 'bulb', desc: 'Ý tưởng, kịch bản & chuẩn bị' },
  { id: 'san-xuat', label: 'Đang sản xuất', icon: 'camera', desc: 'Quay chụp tại phim trường / On-set' },
  { id: 'hau-ky', label: 'Hậu kỳ', icon: 'sliders', desc: 'Dựng phim, âm thanh & màu sắc' },
  { id: 'feedback', label: 'Chỉnh sửa / Feedback', icon: 'message', desc: 'Khách xem bản nháp & phản hồi' },
  { id: 'hoan-thanh', label: 'Hoàn thành', icon: 'award', desc: 'Nghiệm thu & Bàn giao file gốc' },
];

/**
 * Returns stage index (0-4) based on stage name string.
 * Returns -1 if stage name is empty or unrecognized (neutral).
 */
export function getStageIndex(stageName = '') {
  if (!stageName || typeof stageName !== 'string') return -1;
  const clean = stageName.trim().toLowerCase();
  if (!clean) return -1;
  if (clean.includes('hoàn thành')) return 4;
  if (clean.includes('chỉnh sửa') || clean.includes('feedback')) return 3;
  if (clean.includes('hậu kỳ')) return 2;
  if (clean.includes('đang sản xuất') || clean.includes('sản xuất')) return 1;
  if (clean.includes('tiền kỳ')) return 0;
  return -1; // Unrecognized/neutral
}

/**
 * Checks if a project is fully completed.
 * ONLY considered completed if:
 * 1. Stage matches 'Hoàn thành' (includes 'hoàn thành')
 * 2. Progress percentage is strictly 100 (=== 100)
 * 3. If milestones exist (array with length > 0), ALL milestones must have status === 'completed'.
 * If there is any contradiction, does NOT assume completed.
 */
export function isProjectCompleted(stage = '', progress = 0, milestones = []) {
  const clean = (stage || '').trim().toLowerCase();
  const isStageDone = clean.includes('hoàn thành');
  const pNum = Number(progress);
  const isProgressDone = pNum === 100;

  if (!isStageDone || !isProgressDone) {
    return false;
  }

  if (Array.isArray(milestones) && milestones.length > 0) {
    const hasUncompleted = milestones.some((m) => !m || m.status !== 'completed');
    if (hasUncompleted) {
      return false;
    }
  }

  return true;
}

/**
 * Returns the status class and text for a stepper item.
 * Fixes final step bug: when project is completed, the 5th step is marked completed, NOT in_progress.
 */
export function getStepStatus(stepIdx, stageIdx, isCompleted = false) {
  if (isCompleted) {
    return {
      statusClass: 'is-completed',
      statusText: 'Đã hoàn thành',
      isCompleted: true,
      isActive: false,
    };
  }

  if (stageIdx === -1) {
    return {
      statusClass: 'is-pending',
      statusText: 'Chưa cập nhật',
      isCompleted: false,
      isActive: false,
    };
  }

  if (stepIdx < stageIdx) {
    return {
      statusClass: 'is-completed',
      statusText: 'Đã hoàn thành',
      isCompleted: true,
      isActive: false,
    };
  }

  if (stepIdx === stageIdx) {
    return {
      statusClass: 'is-active',
      statusText: 'Đang thực hiện',
      isCompleted: false,
      isActive: true,
    };
  }

  return {
    statusClass: 'is-pending',
    statusText: 'Chưa bắt đầu',
    isCompleted: false,
    isActive: false,
  };
}

/**
 * Extracts next milestone from milestone list.
 * Finds first 'in_progress', then first 'pending'.
 */
export function getNextMilestone(milestones = []) {
  if (!Array.isArray(milestones) || milestones.length === 0) return null;
  const inProgress = milestones.find((m) => m && m.status === 'in_progress');
  if (inProgress) return inProgress;
  const pending = milestones.find((m) => m && m.status === 'pending');
  if (pending) return pending;
  return null;
}

/**
 * Parses diverse date formats into a Date object at end-of-day.
 * Supports DD/MM/YYYY, YYYY-MM-DD, ISO 8601.
 * Strictly verifies calendar validity (e.g. rejects non-existent dates like 31/02/2026).
 */
export function parseProjectDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const s = dateStr.trim();
  if (!s || s === '—' || s === '-') return null;

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const d = new Date(year, month - 1, day, 23, 59, 59, 999);
    // Strict calendar check: verify day/month/year didn't roll over (e.g., 31/02 -> 03/03)
    if (
      !isNaN(d.getTime()) &&
      d.getFullYear() === year &&
      d.getMonth() === month - 1 &&
      d.getDate() === day
    ) {
      return d;
    }
    return null;
  }

  // YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = s.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10);
    const day = parseInt(ymdMatch[3], 10);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const d = new Date(year, month - 1, day, 23, 59, 59, 999);
    if (
      !isNaN(d.getTime()) &&
      d.getFullYear() === year &&
      d.getMonth() === month - 1 &&
      d.getDate() === day
    ) {
      return d;
    }
    return null;
  }

  const timestamp = Date.parse(s);
  if (!isNaN(timestamp)) {
    const d = new Date(timestamp);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  return null;
}

export const parseDate = parseProjectDate;

/**
 * Checks if a project is overdue.
 * Supports both signatures:
 *   isProjectOverdue(dueDateStr, stage, progress, milestones)
 *   isProjectOverdue(dueDateStr, stage, progress, now, milestones)
 * Returns true if valid calendar date exists, date is in past, and project is not truly completed.
 */
export function isProjectOverdue(dueDateStr, stage = '', progress = 0, arg4 = new Date(), arg5 = []) {
  let now = new Date();
  let milestones = [];

  if (Array.isArray(arg4)) {
    milestones = arg4;
    if (arg5 instanceof Date) now = arg5;
  } else {
    if (arg4 instanceof Date) now = arg4;
    if (Array.isArray(arg5)) milestones = arg5;
  }

  const completed = isProjectCompleted(stage, progress, milestones);
  if (completed) return false;

  const due = parseProjectDate(dueDateStr);
  if (!due) return false;

  return now.getTime() > due.getTime();
}

/**
 * Evaluates consistency among stage, progress percentage, and milestone statuses.
 * Returns an array of warning messages (empty if consistent).
 */
export function checkProgressConsistency(stage = '', progress = 0, milestones = []) {
  const warnings = [];
  const cleanStage = (stage || '').trim().toLowerCase();
  const pNum = Number(progress) || 0;
  const isStageDone = cleanStage.includes('hoàn thành');
  const ms = Array.isArray(milestones) ? milestones : [];

  const uncompletedCount = ms.filter((m) => m && m.status !== 'completed').length;
  const allCompleted = ms.length > 0 && uncompletedCount === 0;

  if (isStageDone && pNum < 100) {
    warnings.push(`Giai đoạn đã chọn là "Hoàn thành" nhưng tiến độ hiện tại mới đạt ${pNum}%.`);
  }

  if (pNum >= 100 && !isStageDone) {
    warnings.push(`Tiến độ dự án đã đạt 100% nhưng giai đoạn vẫn chưa chuyển sang "Hoàn thành".`);
  }

  if ((isStageDone || pNum >= 100) && uncompletedCount > 0) {
    warnings.push(`Dự án đã hoàn thành nhưng vẫn còn ${uncompletedCount} mốc công việc chưa tích "Hoàn thành".`);
  }

  if (allCompleted && pNum < 100) {
    warnings.push(`Tất cả ${ms.length} mốc công việc đã hoàn thành nhưng tiến độ tổng chưa đạt 100%.`);
  }

  return warnings;
}

/**
 * Checks if form data has unsaved changes compared to initial data.
 */
export function hasFormUnsavedChanges(current, initial) {
  if (!current || !initial) return false;
  return JSON.stringify(current) !== JSON.stringify(initial);
}

/**
 * Computes suggested progress percentage and stage based on milestone completion.
 * - progress = Math.round((doneCount / total) * 100)
 * - If all milestones are completed (doneCount === total && total > 0) -> stage = 'Hoàn thành'
 * - If not all done but currentStage is currently 'Hoàn thành' -> stage = 'Hậu kỳ'
 * - Otherwise keeps currentStage unchanged
 */
export function computeMilestoneSync(milestones = [], currentStage = '') {
  if (!Array.isArray(milestones) || milestones.length === 0) {
    return {
      progress: 0,
      stage: currentStage || 'Tiền kỳ',
    };
  }

  const total = milestones.length;
  const doneCount = milestones.filter((m) => m && (m.status === 'completed' || m.status === 'done')).length;
  const progress = Math.round((doneCount / total) * 100);

  const cleanStage = (currentStage || '').trim().toLowerCase();
  const isCurrentlyDone = cleanStage.includes('hoàn thành');

  let stage = currentStage;
  if (doneCount === total && total > 0) {
    stage = 'Hoàn thành';
  } else if (isCurrentlyDone) {
    stage = 'Hậu kỳ';
  }

  return { progress, stage };
}

/**
 * Extracts project code from a query string or URLSearchParams object.
 * Checks for ?code= or ?projectCode= or ?project_code=.
 */
export function extractProjectCodeFromQuery(search = '') {
  if (!search) return '';
  try {
    const params = typeof search === 'string'
      ? new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
      : search;
    const code = params.get('code') || params.get('projectCode') || params.get('project_code') || '';
    return code.trim().toUpperCase();
  } catch {
    return '';
  }
}
