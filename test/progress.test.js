import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STAGES_SEQUENCE,
  getStageIndex,
  isProjectCompleted,
  getStepStatus,
  getNextMilestone,
  parseDate,
  parseProjectDate,
  isProjectOverdue,
  checkProgressConsistency,
  hasFormUnsavedChanges,
  computeMilestoneSync,
  extractProjectCodeFromQuery,
} from '../src/utils/progressLogic.js';

test('getStageIndex detects stage or returns -1 for neutral/unrecognized', () => {
  assert.equal(getStageIndex('Tiền kỳ'), 0);
  assert.equal(getStageIndex('Đang sản xuất'), 1);
  assert.equal(getStageIndex('Sản xuất on-set'), 1);
  assert.equal(getStageIndex('Hậu kỳ'), 2);
  assert.equal(getStageIndex('Chỉnh sửa / Feedback'), 3);
  assert.equal(getStageIndex('Hoàn thành'), 4);
  assert.equal(getStageIndex('Dự án đã hoàn thành'), 4);

  // Unrecognized / empty -> -1
  assert.equal(getStageIndex(''), -1);
  assert.equal(getStageIndex(null), -1);
  assert.equal(getStageIndex('Không xác định'), -1);
});

test('isProjectCompleted strictly requires stage=Hoàn thành, progress===100, and all milestones done', () => {
  const milestonesDone = [
    { title: 'M1', status: 'completed' },
    { title: 'M2', status: 'completed' },
  ];
  const milestonesPending = [
    { title: 'M1', status: 'completed' },
    { title: 'M2', status: 'pending' },
  ];

  // Full match -> true
  assert.equal(isProjectCompleted('Hoàn thành', 100, milestonesDone), true);
  assert.equal(isProjectCompleted('Hoàn thành', 100, []), true);
  assert.equal(isProjectCompleted('Dự án Hoàn thành', 100), true);

  // Contradiction 1: Stage Hoàn thành but progress < 100 -> false
  assert.equal(isProjectCompleted('Hoàn thành', 90, milestonesDone), false);

  // Contradiction 2: Progress 100% but stage not Hoàn thành -> false
  assert.equal(isProjectCompleted('Hậu kỳ', 100, milestonesDone), false);
  assert.equal(isProjectCompleted('Đang sản xuất', 100), false);

  // Contradiction 3: Stage Hoàn thành + 100% but milestones still pending -> false
  assert.equal(isProjectCompleted('Hoàn thành', 100, milestonesPending), false);
});

test('getStepStatus correctly displays final step as completed only when project is truly completed', () => {
  const stageIdx = getStageIndex('Hoàn thành');
  assert.equal(stageIdx, 4);

  // When project is truly completed (stage=Hoàn thành, 100%, all milestones done)
  const isCompleted = isProjectCompleted('Hoàn thành', 100, [{ status: 'completed' }]);
  assert.equal(isCompleted, true);

  for (let idx = 0; idx < 5; idx++) {
    const status = getStepStatus(idx, stageIdx, isCompleted);
    assert.equal(status.isCompleted, true, `Step ${idx} must be completed`);
    assert.equal(status.statusText, 'Đã hoàn thành', `Step ${idx} text must be Đã hoàn thành`);
    assert.equal(status.statusClass, 'is-completed');
  }

  // When stage is 'Hoàn thành' but milestones are not done -> isCompleted = false
  const fakeCompleted = isProjectCompleted('Hoàn thành', 100, [{ status: 'pending' }]);
  assert.equal(fakeCompleted, false);
  const step4Pending = getStepStatus(4, stageIdx, fakeCompleted);
  assert.equal(step4Pending.isCompleted, false);
  assert.equal(step4Pending.statusClass, 'is-active');
  assert.equal(step4Pending.statusText, 'Đang thực hiện');

  // When project is in earlier stage, e.g. 'Hậu kỳ' (idx 2)
  const inProgressStageIdx = getStageIndex('Hậu kỳ');
  assert.equal(inProgressStageIdx, 2);
  const step0 = getStepStatus(0, inProgressStageIdx, false);
  const step1 = getStepStatus(1, inProgressStageIdx, false);
  const step2 = getStepStatus(2, inProgressStageIdx, false);
  const step3 = getStepStatus(3, inProgressStageIdx, false);

  assert.equal(step0.statusClass, 'is-completed');
  assert.equal(step1.statusClass, 'is-completed');
  assert.equal(step2.statusClass, 'is-active');
  assert.equal(step2.statusText, 'Đang thực hiện');
  assert.equal(step3.statusClass, 'is-pending');
  assert.equal(step3.statusText, 'Chưa bắt đầu');

  // When stage is neutral / unrecognized (-1)
  const neutralStep = getStepStatus(0, -1, false);
  assert.equal(neutralStep.statusClass, 'is-pending');
  assert.equal(neutralStep.statusText, 'Chưa cập nhật');
});

test('getNextMilestone accurately identifies next milestone without assuming client review', () => {
  const milestones = [
    { title: 'Kịch bản', status: 'completed' },
    { title: 'Quay phim', status: 'in_progress' },
    { title: 'Dựng phim', status: 'pending' },
  ];
  const next = getNextMilestone(milestones);
  assert.ok(next);
  assert.equal(next.title, 'Quay phim');
  assert.equal(next.status, 'in_progress');

  const pendingMilestones = [
    { title: 'Kịch bản', status: 'completed' },
    { title: 'Quay phim', status: 'completed' },
    { title: 'Dựng phim', status: 'pending' },
  ];
  const nextPending = getNextMilestone(pendingMilestones);
  assert.equal(nextPending.title, 'Dựng phim');

  const allCompleted = [
    { title: 'Kịch bản', status: 'completed' },
    { title: 'Quay phim', status: 'completed' },
  ];
  assert.equal(getNextMilestone(allCompleted), null);
  assert.equal(getNextMilestone([]), null);
});

test('parseProjectDate rejects non-existent calendar dates like 31/02/2026', () => {
  // Valid dates
  const d1 = parseProjectDate('25/10/2026');
  assert.ok(d1);
  assert.equal(d1.getFullYear(), 2026);
  assert.equal(d1.getMonth(), 9); // October
  assert.equal(d1.getDate(), 25);

  const d2 = parseProjectDate('2026-11-05');
  assert.ok(d2);
  assert.equal(d2.getFullYear(), 2026);
  assert.equal(d2.getMonth(), 10); // November
  assert.equal(d2.getDate(), 5);

  // Leap year: 29/02/2024 is valid
  const leap = parseProjectDate('29/02/2024');
  assert.ok(leap);
  assert.equal(leap.getDate(), 29);

  // Non-leap year: 29/02/2026 is invalid
  assert.equal(parseProjectDate('29/02/2026'), null);

  // Non-existent dates: 31/02/2026
  assert.equal(parseProjectDate('31/02/2026'), null);

  // 31/04/2026 (April has 30 days)
  assert.equal(parseProjectDate('31/04/2026'), null);

  // 31/06/2026 (June has 30 days)
  assert.equal(parseProjectDate('31/06/2026'), null);

  // Empty / placeholder
  assert.equal(parseProjectDate('—'), null);
  assert.equal(parseProjectDate(''), null);
  assert.equal(parseProjectDate(null), null);
  assert.equal(parseDate('31/02/2026'), null);
});

test('isProjectOverdue warns on past date if project is not completed and date is valid', () => {
  const pastDateStr = '01/01/2025';
  const futureDateStr = '31/12/2030';
  const invalidDateStr = '31/02/2026';
  const fakeNow = new Date('2026-06-01T12:00:00Z');

  // Past date, not completed -> Overdue
  assert.equal(isProjectOverdue(pastDateStr, 'Đang sản xuất', 50, fakeNow), true);

  // Past date, but truly completed -> Not overdue
  assert.equal(isProjectOverdue(pastDateStr, 'Hoàn thành', 100, fakeNow), false);

  // Contradiction: stage Hoàn thành but progress 50% -> Not completed -> Overdue!
  assert.equal(isProjectOverdue(pastDateStr, 'Hoàn thành', 50, fakeNow), true);

  // Critical case: Hoàn thành + 100% but has pending milestones and past due date -> OVERDUE!
  const pendingMilestones = [
    { title: 'Quay phim', status: 'completed' },
    { title: 'Bàn giao Master', status: 'pending' },
  ];
  const allDoneMilestones = [
    { title: 'Quay phim', status: 'completed' },
    { title: 'Bàn giao Master', status: 'completed' },
  ];
  assert.equal(isProjectOverdue(pastDateStr, 'Hoàn thành', 100, fakeNow, pendingMilestones), true);
  assert.equal(isProjectOverdue(pastDateStr, 'Hoàn thành', 100, pendingMilestones), true); // 4-arg signature
  assert.equal(isProjectOverdue(pastDateStr, 'Hoàn thành', 100, fakeNow, allDoneMilestones), false);
  assert.equal(isProjectOverdue(pastDateStr, 'Hoàn thành', 100, allDoneMilestones), false); // 4-arg signature

  // Future date -> Not overdue
  assert.equal(isProjectOverdue(futureDateStr, 'Tiền kỳ', 25, fakeNow), false);

  // Invalid date (31/02/2026) -> Rejects without crashing or false warning
  assert.equal(isProjectOverdue(invalidDateStr, 'Đang sản xuất', 50, fakeNow), false);

  // Invalid date placeholder -> Not overdue
  assert.equal(isProjectOverdue('—', 'Đang sản xuất', 50, fakeNow), false);
});

test('checkProgressConsistency detects contradictions between stage, percent, and milestones', () => {
  // Case 1: Stage Hoàn thành but progress 80%
  const warn1 = checkProgressConsistency('Hoàn thành', 80, [{ status: 'completed' }]);
  assert.ok(warn1.length > 0);
  assert.ok(warn1.some((w) => w.includes('mới đạt 80%')));

  // Case 2: Progress 100% but stage Tiền kỳ
  const warn2 = checkProgressConsistency('Tiền kỳ', 100, [{ status: 'completed' }]);
  assert.ok(warn2.length > 0);
  assert.ok(warn2.some((w) => w.includes('chưa chuyển sang "Hoàn thành"')));

  // Case 3: Completed stage but has pending milestones
  const warn3 = checkProgressConsistency('Hoàn thành', 100, [
    { title: 'M1', status: 'completed' },
    { title: 'M2', status: 'pending' },
  ]);
  assert.ok(warn3.some((w) => w.includes('1 mốc công việc chưa tích "Hoàn thành"')));

  // Consistent case
  const warnClean = checkProgressConsistency('Hoàn thành', 100, [
    { title: 'M1', status: 'completed' },
    { title: 'M2', status: 'completed' },
  ]);
  assert.equal(warnClean.length, 0);
});

test('hasFormUnsavedChanges accurately flags dirty form states', () => {
  const initial = {
    projectName: 'TVC Act 1',
    progress: 50,
    stage: 'Đang sản xuất',
  };

  const same = {
    projectName: 'TVC Act 1',
    progress: 50,
    stage: 'Đang sản xuất',
  };

  const changed = {
    projectName: 'TVC Act 1',
    progress: 75,
    stage: 'Đang sản xuất',
  };

  assert.equal(hasFormUnsavedChanges(same, initial), false);
  assert.equal(hasFormUnsavedChanges(changed, initial), true);
});

test('computeMilestoneSync accurately calculates progress and suggests stage', () => {
  // Case 1: All milestones completed -> 100% and stage Hoàn thành
  const allDone = [
    { title: 'M1', status: 'completed' },
    { title: 'M2', status: 'completed' },
  ];
  const sync1 = computeMilestoneSync(allDone, 'Đang sản xuất');
  assert.equal(sync1.progress, 100);
  assert.equal(sync1.stage, 'Hoàn thành');

  // Case 2: Partial completion (1 of 3) -> 33% and keeps current stage
  const partial = [
    { title: 'M1', status: 'completed' },
    { title: 'M2', status: 'in_progress' },
    { title: 'M3', status: 'pending' },
  ];
  const sync2 = computeMilestoneSync(partial, 'Tiền kỳ');
  assert.equal(sync2.progress, 33);
  assert.equal(sync2.stage, 'Tiền kỳ');

  // Case 3: Partial completion (2 of 4) but stage was mistakenly set to Hoàn thành -> rolls back to Hậu kỳ
  const rollback = [
    { title: 'M1', status: 'completed' },
    { title: 'M2', status: 'completed' },
    { title: 'M3', status: 'pending' },
    { title: 'M4', status: 'pending' },
  ];
  const sync3 = computeMilestoneSync(rollback, 'Hoàn thành');
  assert.equal(sync3.progress, 50);
  assert.equal(sync3.stage, 'Hậu kỳ');

  // Case 4: Empty milestones -> 0% and keeps stage
  const sync4 = computeMilestoneSync([], 'Hậu kỳ');
  assert.equal(sync4.progress, 0);
  assert.equal(sync4.stage, 'Hậu kỳ');
});

test('extractProjectCodeFromQuery extracts project code from URLs or query strings', () => {
  assert.equal(extractProjectCodeFromQuery('?code=NR-001'), 'NR-001');
  assert.equal(extractProjectCodeFromQuery('?projectCode=acts-tvc'), 'ACTS-TVC');
  assert.equal(extractProjectCodeFromQuery('project_code=viral-02'), 'VIRAL-02');
  assert.equal(extractProjectCodeFromQuery('?other=123&code=NR-003&ref=home'), 'NR-003');
  assert.equal(extractProjectCodeFromQuery(''), '');
  assert.equal(extractProjectCodeFromQuery(null), '');
});
