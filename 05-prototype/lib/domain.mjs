import { randomUUID } from 'node:crypto';
export class Problem extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
export const check = (condition, message, status = 400) => { if (!condition) throw new Problem(message, status); };
export const copy = value => structuredClone(value);
export function createVisit() {
  return {
    id: randomUUID(), revision: 0, sourceVersion: 0, createdAt: new Date().toISOString(),
    patient: { name: 'Trần Đức Đăng Khôi', specialty: 'Sản khoa', synthetic: true },
    summary: null, generationId: null, events: [],
    tasks: [
      { id: 'blood', name: 'Lấy mẫu xét nghiệm', kind: 'lab', priority: 1, room: 'L01', floor: 'Tầng 1',
        directions: ['Từ sảnh minh họa, đi thẳng tới khu A.', 'Rẽ trái tại quầy hướng dẫn, tìm phòng L01.', 'Báo đã đến với nhân viên; làm theo hướng dẫn tại phòng.'],
        available: true, waitMinutes: 8, dependencies: [], requiresResults: [], service: 'pending', patientConfirmed: false, result: null },
      { id: 'imaging', name: 'Chẩn đoán hình ảnh', kind: 'imaging', priority: 2, room: 'C02', floor: 'Tầng 2',
        directions: ['Từ khu lấy mẫu, tới thang máy B.', 'Lên tầng 2, rẽ phải theo biển khu C.', 'Đến phòng C02, báo nhân viên để được xác nhận.'],
        available: true, waitMinutes: 12, dependencies: ['blood'], requiresResults: [], service: 'pending', patientConfirmed: false, result: null },
      { id: 'consult', name: 'Quay lại bác sĩ', kind: 'consult', priority: 3, room: 'K03', floor: 'Tầng 1',
        directions: ['Đi thang máy B về tầng 1.', 'Theo biển khu khám K, tìm phòng K03.', 'Báo nhân viên bạn đã hoàn tất các dịch vụ.'],
        available: true, waitMinutes: 5, dependencies: ['blood', 'imaging'], requiresResults: ['blood', 'imaging'], service: 'pending', patientConfirmed: false, result: null }
    ]
  };
}
export function sampleResult(task, revision = 1) {
  const base = { id: `${task.id}-result`, source: 'PHIẾU NGUỒN GIẢ LẬP · không phải hồ sơ Vinmec', revision,
    releasedAt: new Date().toISOString(), readings: [], report: '' };
  if (task.id === 'blood') base.readings = [
    { name: 'Glucose', value: revision === 1 ? '6.2' : '6.3', unit: 'mmol/L', flag: 'H', reference: 'Không thiết lập khoảng tham chiếu trong demo' },
    { name: 'Hemoglobin', value: '135', unit: 'g/L', flag: '', reference: 'Không thiết lập khoảng tham chiếu trong demo' }
  ];
  else {
    base.source = 'PHIẾU SIÊU ÂM SẢN KHOA GIẢ LẬP · không phải hồ sơ thật';
    base.readings = [
      { name: 'CRL', value: revision === 1 ? '58.4' : '59.1', unit: 'mm', flag: '', reference: 'Phép đo giả lập; đối chiếu tuổi thai và mặt cắt chuẩn' },
      { name: 'NT', value: revision === 1 ? '1.8' : '2.0', unit: 'mm', flag: '', reference: 'Phép đo giả lập; không dùng riêng để kết luận nguy cơ' },
      { name: 'Tim thai', value: revision === 1 ? '164' : '162', unit: 'bpm', flag: '', reference: 'Phép đo giả lập; cần đối chiếu chất lượng tín hiệu' },
      { name: 'Tuổi thai theo siêu âm', value: '12 tuần 2 ngày', unit: '', flag: '', reference: 'Ước tính giả lập; bác sĩ xác nhận' }
    ];
    base.report = 'Mô tả siêu âm sản khoa giả lập. Nhận định hỗ trợ cần bác sĩ đối chiếu ảnh, mặt cắt, tuổi thai và bối cảnh lâm sàng.';
  }
  return base;
}
export function blockers(visit, task) {
  const reasons = [];
  for (const id of task.dependencies) if (visit.tasks.find(t => t.id === id)?.service !== 'performed') reasons.push(`Chờ hoàn tất: ${visit.tasks.find(t => t.id === id)?.name}`);
  for (const id of task.requiresResults) if (!visit.tasks.find(t => t.id === id)?.result) reasons.push(`Chờ kết quả: ${visit.tasks.find(t => t.id === id)?.name}`);
  if (!task.available) reasons.push('Phòng tạm chưa sẵn sàng; liên hệ nhân viên nếu cần hỗ trợ.');
  return reasons;
}
export function route(visit) {
  return visit.tasks.filter(t => t.service !== 'performed' && !blockers(visit, t).length)
    .sort((a, b) => a.priority - b.priority || a.waitMinutes - b.waitMinutes)[0]?.id ?? null;
}
export function sources(visit) { return visit.tasks.filter(t => t.result).map(t => ({ taskId: t.id, taskName: t.name, ...copy(t.result) })); }
export function record(visit, type, detail) {
  visit.revision++;
  visit.events.unshift({ at: new Date().toISOString(), type, detail });
  visit.events = visit.events.slice(0, 60);
}
export function assertRevision(visit, revision) { check(Number.isInteger(revision) && revision === visit.revision, 'Phiên vừa thay đổi. Tải lại trạng thái rồi thử lại.', 409); }
export function getTask(visit, id) { const t = visit.tasks.find(t => t.id === id); check(t, 'Không tìm thấy chỉ định.', 404); return t; }
export function confirmPatient(visit, id) {
  const task = getTask(visit, id);
  if (task.patientConfirmed || task.service === 'performed') return;
  check(!blockers(visit, task).length, 'Chưa đủ điều kiện tới phòng này.');
  task.patientConfirmed = true;
  record(visit, 'patient-confirm', `Người dùng xác nhận đã thực hiện: ${task.name}. Chờ nhân viên xác nhận.`);
}
export function completeService(visit, id) {
  const task = getTask(visit, id);
  if (task.service === 'performed') return;
  check(!blockers(visit, task).length, 'Chưa đủ điều kiện hoàn tất dịch vụ.');
  task.service = 'performed';
  record(visit, 'service', `Nhân viên mô phỏng xác nhận: ${task.name}`);
}
export function configureTask(visit, id, data) {
  const task = getTask(visit, id);
  check(typeof data.room === 'string' && data.room.trim().length > 0 && data.room.length <= 40, 'Phòng không hợp lệ.');
  check(typeof data.floor === 'string' && data.floor.trim().length > 0 && data.floor.length <= 60, 'Tầng không hợp lệ.');
  check(typeof data.directions === 'string' && data.directions.trim().length > 0 && data.directions.length <= 1500, 'Cần hướng dẫn đường đi.');
  check(typeof data.available === 'boolean' && Number.isInteger(data.waitMinutes) && data.waitMinutes >= 0 && data.waitMinutes <= 240, 'Thời gian chờ cần nằm trong 0–240 phút.');
  check(Number.isInteger(data.priority) && data.priority >= 1 && data.priority <= 99, 'Ưu tiên phải từ 1 đến 99.');
  Object.assign(task, { room: data.room.trim(), floor: data.floor.trim(), directions: data.directions.split('\n').map(s => s.trim()).filter(Boolean), available: data.available, waitMinutes: data.waitMinutes, priority: data.priority });
  record(visit, 'routing', `Cập nhật phòng, hướng dẫn hoặc hàng đợi: ${task.name}`);
}
export function validateResult(result) {
  check(result && typeof result === 'object' && !Array.isArray(result), 'Kết quả cần là đối tượng JSON.');
  check(typeof result.source === 'string' && result.source.length > 0 && result.source.length <= 200, 'Kết quả cần ghi nguồn.');
  check(typeof result.report === 'string' && result.report.length <= 2000, 'Mô tả không hợp lệ.');
  check(Array.isArray(result.readings) && result.readings.length <= 20, 'Danh sách chỉ số không hợp lệ.');
  check(result.readings.length > 0 || result.report.trim().length > 0, 'Kết quả trống không được phát hành.');
  for (const r of result.readings) {
    check(r && ['name', 'value', 'unit', 'flag', 'reference'].every(k => typeof r[k] === 'string' && r[k].length <= 300), 'Mỗi chỉ số phải có name, value, unit, flag, reference dạng chuỗi.');
    check(r.name.trim() && r.value.trim() && ['', 'H', 'L', 'CRITICAL'].includes(r.flag), 'Thiếu tên/giá trị hoặc cờ nguồn không hợp lệ.');
  }
}
export function publishResult(visit, id, data) {
  const task = getTask(visit, id);
  check(task.kind !== 'consult' && task.service === 'performed', 'Chỉ phát hành kết quả sau khi dịch vụ đã được nhân viên xác nhận.');
  const result = data ?? sampleResult(task, (task.result?.revision ?? 0) + 1);
  validateResult(result);
  task.result = { id: `${id}-result`, source: result.source, report: result.report, readings: result.readings.map(r => ({ name: r.name, value: r.value, unit: r.unit, flag: r.flag, reference: r.reference })), revision: (task.result?.revision ?? 0) + 1, releasedAt: new Date().toISOString() };
  visit.sourceVersion++;
  visit.summary = null; visit.generationId = null;
  record(visit, 'result', `Phát hành nguồn giả lập: ${task.name}; mọi bản tóm tắt cũ đã mất hiệu lực.`);
}
export function startDraft(visit) {
  check(sources(visit).length, 'Chưa có kết quả nguồn để tổng hợp.');
  const token = randomUUID(); visit.generationId = token;
  record(visit, 'draft-start', 'Đang soạn bản nháp; chưa gửi người bệnh.');
  return { token, sourceVersion: visit.sourceVersion, results: sources(visit) };
}
export function validateSections(sections, results) {
  check(Array.isArray(sections) && sections.length === results.length, 'AI trả sai số mục kết quả.', 422);
  const ids = new Set();
  for (const section of sections) {
    check(section && results.some(r => r.id === section.resultId) && !ids.has(section.resultId), 'AI trả nguồn trùng hoặc không tồn tại.', 422);
    check(typeof section.explanation === 'string' && section.explanation.trim().length >= 10 && section.explanation.length <= 1000, 'Giải thích thiếu hoặc quá dài.', 422);
    check(typeof section.assessment === 'string' && section.assessment.length <= 1000 && !/(chẩn đoán là|bạn (bị|mắc)|điều trị|kê đơn)/iu.test(section.assessment), 'Nhận định hỗ trợ vượt phạm vi cho phép.', 422);
    check(['thấp', 'vừa', 'cao', ''].includes(section.confidence), 'Mức tin cậy không hợp lệ.', 422);
    check(!/\d/.test(section.explanation), 'Phần giải thích không được tạo số liệu; xem số liệu tại nguồn.', 422);
    check(!/(bạn (bị|mắc)|chẩn đoán là|nên (uống|dùng)|kê đơn|tăng liều|giảm liều)/iu.test(section.explanation), 'Nội dung có dấu hiệu vượt phạm vi giải thích.', 422);
    ids.add(section.resultId);
  }
  return sections.map(s => ({ resultId: s.resultId, assessment: s.assessment.trim(), confidence: s.confidence, explanation: s.explanation.trim() }));
}
export function finishDraft(visit, pending, sections, mode) {
  check(visit.sourceVersion === pending.sourceVersion && visit.generationId === pending.token, 'Nguồn hoặc yêu cầu đã thay đổi khi AI đang soạn. Hãy tạo lại.', 409);
  const clean = validateSections(sections, pending.results);
  visit.summary = { id: randomUUID(), sourceVersion: pending.sourceVersion, status: 'draft', mode, createdAt: new Date().toISOString(), sections: clean, sourceSnapshot: copy(pending.results) };
  visit.generationId = null;
  record(visit, 'draft', `Đã tạo bản nháp (${mode}); chờ bác sĩ mô phỏng duyệt.`);
}
export function reviewDraft(visit, data) {
  const summary = visit.summary;
  check(summary && summary.id === data.draftId && summary.sourceVersion === visit.sourceVersion && summary.status === 'draft', 'Bản nháp không còn hợp lệ để duyệt.', 409);
  if (data.action === 'reject') { summary.status = 'rejected'; record(visit, 'reject', 'Bác sĩ mô phỏng từ chối bản nháp.'); return; }
  check(data.action === 'approve', 'Thao tác duyệt không hợp lệ.');
  summary.sections = validateSections(data.sections, summary.sourceSnapshot);
  summary.status = 'approved'; summary.approvedAt = new Date().toISOString();
  record(visit, 'approve', 'Bác sĩ mô phỏng duyệt và phát hành giải thích.');
}
export function viewVisit(visit, role = 'patient') {
  const out = copy(visit); out.nextTaskId = route(visit); out.completed = visit.tasks.every(t => t.service === 'performed');
  out.tasks.forEach(t => { t.blockers = blockers(visit, t); });
  if (role !== 'staff') {
    out.summary = visit.summary?.status === 'approved' && visit.summary.sourceVersion === visit.sourceVersion ? copy(visit.summary) : null;
    out.events = []; delete out.generationId;
  }
  return out;
}
