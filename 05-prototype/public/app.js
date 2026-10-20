const app = document.querySelector('#app');
const staff = location.pathname === '/staff';
const role = staff ? 'staff' : 'patient';
let visit, tab = 'journey', busy = false, config = {}, confirmingReset = false;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icons = {
 arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', check: '<path d="m5 12 4 4L19 6"/>', pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', result: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7m-7 4h7"/>', help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 0-1 1-1 2m0 3h.01"/>',
 route: '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v7a4 4 0 0 0 4 4h6M18 17V9a4 4 0 0 0-4-4h-2"/>', shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.result}</svg>`;
const badge = (text, style = '') => `<span class="badge ${style}">${escape(text)}</span>`;
const btn = (text, action, taskId = '', disabled = false, style = '') => `<button class="button ${style}" data-action="${action}" data-task="${taskId}" ${disabled ? 'disabled' : ''}>${text}</button>`;
function notify(message, error = false) {
 const notice = document.querySelector('#notice'); notice.textContent = message; notice.className = `notice show ${error ? 'error' : ''}`;
 clearTimeout(notify.timer); notify.timer = setTimeout(() => notice.classList.remove('show'), 6500);
}
async function api(path, data) {
 const res = await fetch(`/api/${path}`, { method: data ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', 'X-Demo-Role': role }, ...(data ? { body: JSON.stringify(data) } : {}) });
 const value = await res.json();
 if (!res.ok) { const error = new Error(value.error || 'Không tải được dữ liệu.'); error.status = res.status; throw error; }
 if (path.startsWith('visits/') && (!value?.id || !value?.patient?.name || !Array.isArray(value.tasks))) throw new Error('Phiên trả về dữ liệu không đầy đủ. Hãy mở lại link thử nghiệm.');
 return value;
}
function sessionUrl(path) { return `${path}?visit=${encodeURIComponent(visit.id)}`; }
function header() {
 const completed = visit.tasks.filter(t => t.service === 'performed').length;
 const results = visit.tasks.filter(t => t.result).length;
 return `<section class="page-title"><div><p class="eyebrow">${staff ? 'BÀN ĐIỀU PHỐI · MÔ PHỎNG' : 'LƯỢT KHÁM CỦA BẠN'}</p><h1>${staff ? 'Một luồng thông tin. Hai phía cùng rõ.' : 'Bước tiếp theo, luôn rõ ràng.'}</h1><p class="subtitle">${staff ? 'Cập nhật dịch vụ, kết quả và duyệt nội dung trước khi gửi.' : 'Theo dõi tiến độ, tìm đúng phòng và nhận thông tin trong một nơi.'}</p></div><div class="session-id"><span>PHIÊN GIẢ LẬP</span><strong>${escape(visit.id.slice(0, 8).toUpperCase())}</strong><span>Đã lưu tự động trên máy này</span></div></section>
 <p class="caption"><strong>${escape(visit.patient.name)}</strong> · ${escape(visit.patient.specialty)} · dữ liệu giả lập</p><div class="overview"><div><span class="metric">${completed}<small>/3</small></span><span>dịch vụ đã thực hiện</span></div><div><span class="metric">${results}<small>/2</small></span><span>phiếu kết quả đã có</span></div><div class="overview-note">${icon('shield')}<span>${visit.summary?.status === 'approved' ? 'Giải thích đã được duyệt trong mô phỏng' : 'Giải thích kết quả cần bác sĩ duyệt'}<small>Thực hiện dịch vụ và có kết quả là hai trạng thái riêng.</small></span></div></div>`;
}
function sourceCard(t) {
 if (!t.result) return `<div class="empty-source">${icon('clock')}<div><strong>Chưa có kết quả nguồn</strong><p>${t.service === 'performed' ? 'Dịch vụ đã thực hiện. Kết quả đang chờ phát hành.' : 'Kết quả sẽ xuất hiện sau khi thực hiện và được phát hành.'}</p></div></div>`;
 const r = t.result;
 return `<div class="source"><div class="source-meta">${badge('Phiếu nguồn giả lập')}<span>Phiên bản ${r.revision}</span></div><h3>${escape(t.name)}</h3>
 ${r.readings.length ? `<div class="table-wrap"><table><thead><tr><th>Chỉ số</th><th>Giá trị gốc</th><th>Cờ nguồn</th></tr></thead><tbody>${r.readings.map(x => `<tr><td><strong>${escape(x.name)}</strong><small>${escape(x.reference)}</small></td><td>${escape(x.value)} <small class="unit">${escape(x.unit)}</small></td><td>${x.flag ? badge(x.flag, 'warning') : '—'}</td></tr>`).join('')}</tbody></table></div>` : ''}
 ${r.report ? `<p class="report">${escape(r.report)}</p>` : ''}<p class="caption">${escape(r.source)} · ${escape(r.id)} · v${r.revision}</p>
 ${r.readings.some(x => x.flag) ? '<p class="flag-note">Cờ H/L/CRITICAL được chép từ phiếu giả lập, không phải kết luận hoặc cảnh báo do AI tự tạo.</p>' : ''}</div>`;
}
function summaryCard() {
 const s = visit.summary;
 if (!s || s.status !== 'approved') return `<div class="pending-summary">${icon('shield')}<h3>Giải thích đang chờ bác sĩ duyệt</h3><p>Bạn vẫn có thể xem phiếu nguồn đã phát hành. Bản nháp giải thích chưa được gửi tới màn hình người bệnh.</p></div>`;
 return `<section class="approved-summary"><div class="section-heading"><h2>Giải thích dễ hiểu</h2>${badge('✓ Bác sĩ duyệt · MÔ PHỎNG', 'success')}</div><p class="caption">${s.mode === 'demo' ? 'Nội dung mẫu tạo sẵn, không gọi AI trực tiếp' : 'AI tạo bản nháp, đã qua bước duyệt mô phỏng'} · phiên bản nguồn ${s.sourceVersion}</p>${s.sections.map(x => `<article><h3>${escape(s.sourceSnapshot.find(r => r.id === x.resultId)?.taskName)}</h3><p><strong>Nhận định hỗ trợ:</strong> ${escape(x.assessment || 'Không có nhận định riêng.')}${x.confidence ? ` <small>· mức ${escape(x.confidence)}</small>` : ''}</p><p>${escape(x.explanation)}</p><small>Nguồn: ${escape(x.resultId)}</small></article>`).join('')}<p class="flag-note">Nhận định hỗ trợ không phải chẩn đoán. Bước duyệt trong demo không phải xác nhận y khoa thực tế.</p></section>`;
}
function mapView(next) {
 const floors = [...new Set([visit.tasks[1].floor, visit.tasks[0].floor, visit.tasks[2].floor])];
 return floors.map((floor, i) => `${i ? '<div class="map-connector">↕ Lối nối minh họa</div>' : ''}<div class="map-floor"><span>${escape(floor.toUpperCase())}</span>${visit.tasks.filter(t => t.floor === floor).map(t => `<div class="map-room ${next?.id === t.id ? 'selected' : ''}">${escape(t.room)}<small>${escape(t.name)}</small></div>`).join('')}</div>`).join('') + '<div class="map-entry">↑ Sảnh minh họa</div>';
}
function journey() {
 const next = visit.tasks.find(t => t.id === visit.nextTaskId);
 const pending = visit.tasks.filter(t => t.kind !== 'consult' && !t.result && t.service === 'performed');
 return `<div class="patient-grid"><section class="main-column"><section class="info-card"><h2>Cách dùng màn hình này</h2><ol><li>Đọc điểm đến, tầng và từng bước chỉ dẫn.</li><li>Đến nơi rồi bấm “Đã thực hiện tại phòng”.</li><li>Chờ nhân viên xác nhận; kết quả chỉ xuất hiện sau khi được phát hành và bác sĩ duyệt.</li></ol><p class="caption">Mở Hành trình để đi tiếp, Kết quả để xem phiếu đã phát hành, hoặc Hỗ trợ khi chưa rõ bước tiếp theo.</p></section><div class="next-card"><p class="eyebrow">${visit.completed ? 'ĐÃ HOÀN TẤT LỘ TRÌNH DEMO' : next ? 'ĐIỂM ĐẾN TIẾP THEO' : 'ĐANG CHỜ CẬP NHẬT'}</p>
 <h2>${visit.completed ? 'Bạn đã hoàn tất các bước.' : next ? escape(next.name) : 'Bạn có thể nghỉ tại khu chờ.'}</h2>
 <p>${visit.completed ? 'Xem lại kết quả và phần giải thích đã duyệt tại mục Kết quả.' : next ? 'Lộ trình dựa trên điều kiện, trạng thái và tải hàng đợi do nhân viên mô phỏng cập nhật.' : 'Chưa có phòng đủ điều kiện tiếp nhận. Xem lý do trong lộ trình hoặc yêu cầu hỗ trợ.'}</p>
 ${next ? `<div class="destination">${icon('pin')}<strong>${escape(next.room)}</strong><span>${escape(next.floor)} · Phòng giả lập</span><span class="wait">${icon('clock')}Đang đợi: ${next.waitingCount} người · làm trung bình ${next.averageServiceMinutes} phút</span><span class="wait">${icon('clock')}Ước tính tới lượt: ${next.waitMinutes + next.waitingCount * next.averageServiceMinutes} phút</span></div><p class="route-reason"><strong>Gợi ý:</strong> ${escape(visit.nextTaskReason)}</p><ol class="directions">${next.directions.map(d => `<li>${escape(d)}</li>`).join('')}</ol>${btn(`${icon('check')} ${next.patientConfirmed ? 'Đã ghi nhận · chờ nhân viên' : 'Đã thực hiện tại phòng'}`, 'patient-confirm', next.id, next.patientConfirmed, 'light')}<small class="next-footnote">*Ước tính mô phỏng từ số người đang đợi và thời gian phục vụ trung bình; không phải lịch hẹn thật.</small>` : ''}</div>
 <div class="section-heading"><h2>Lộ trình của bạn</h2><span class="caption">3 điểm đến · cùng một lượt khám</span></div><div class="timeline">${visit.tasks.map((t, i) => {
 const done = t.service === 'performed', current = t.id === visit.nextTaskId;
 return `<article class="step ${done ? 'done' : current ? 'current' : ''}"><div class="step-index">${done ? icon('check') : String(i + 1).padStart(2, '0')}</div><div class="step-content"><div class="step-top"><h3>${escape(t.name)}</h3>${badge(done ? '✓ Đã thực hiện' : current ? '→ Tiếp theo' : '◷ Chưa thực hiện', done ? 'success' : current ? 'active' : '')}</div><p>${escape(t.floor)} · Phòng ${escape(t.room)} · ${t.available ? 'Đang tiếp nhận' : 'Tạm chưa sẵn sàng'}</p>
 <div class="step-status">${t.kind !== 'consult' ? badge(t.result ? '▤ Đã có kết quả' : '◷ Chưa có kết quả', t.result ? 'success' : '') : badge('Tư vấn kết quả với bác sĩ')}${t.patientConfirmed && !done ? badge('Bạn xác nhận · chờ nhân viên', 'warning') : ''}</div>
 ${!done && t.blockers.length ? `<ul class="blockers">${t.blockers.map(b => `<li>${escape(b)}</li>`).join('')}</ul>` : ''}</div></article>`;
 }).join('')}</div></section>
 <aside class="side-column"><section class="map-card"><p class="eyebrow">SƠ ĐỒ MINH HỌA</p><h2>Đúng nơi. Đúng bước.</h2><div class="mini-map">${mapView(next)}</div><p class="caption">Không phải bản đồ hoặc chỉ dẫn tại cơ sở Vinmec thực tế.</p></section>
 <section class="info-card">${icon('result')}<h3>Kết quả được cập nhật riêng</h3><p>${pending.length ? `${pending.length} dịch vụ đã thực hiện đang chờ kết quả. Bạn có thể đi tiếp nếu điểm đến đã đủ điều kiện.` : 'Không cần chờ kết quả tại từng phòng nếu điểm đến tiếp theo đã đủ điều kiện.'}</p><button class="text-button" data-tab="results">Xem kết quả ${icon('arrow')}</button></section><section class="help-card"><h3>Cần một người hỗ trợ?</h3><p>Chưa rõ đường đi hoặc bước tiếp theo?</p><button class="text-button" data-tab="help">Mở hỗ trợ ${icon('arrow')}</button></section></aside></div>`;
}
function resultsPage() { return `<div class="results-grid"><section><div class="section-heading"><h2>Phiếu kết quả nguồn</h2>${badge('Dữ liệu giả lập')}</div>${visit.tasks.filter(t => t.kind !== 'consult').map(sourceCard).join('')}</section><section>${summaryCard()}</section></div>`; }
function helpPage() { return `<section class="help-page"><p class="eyebrow">LUÔN CÓ ĐƯỜNG HỖ TRỢ</p><h2>Bạn cần hỗ trợ trực tiếp?</h2><p>Nếu đang ở cơ sở y tế, hãy tìm quầy tiếp đón hoặc nhân viên gần nhất để được hướng dẫn. Prototype không kết nối nhân viên thật.</p>${btn('Gửi yêu cầu hỗ trợ trong demo', 'help')}<div class="emergency"><h3>Trường hợp cần trợ giúp khẩn cấp</h3><p>Dừng sử dụng luồng tự động và tìm nhân viên y tế trực tiếp. Đầu mối khẩn cấp theo cơ sở cần được xác minh trước khi triển khai thực tế.</p><strong>Demo không đánh giá triệu chứng hoặc thực hiện chuyển tuyến thật.</strong></div></section>`; }
function staffTask(t) {
 const done = t.service === 'performed';
 return `<article class="staff-task"><div class="section-heading"><h3>${escape(t.name)}</h3>${badge(done ? '✓ Đã thực hiện' : '◷ Chờ thực hiện', done ? 'success' : '')}</div><p class="caption">${t.patientConfirmed ? 'Người bệnh đã xác nhận thực hiện.' : 'Chưa có xác nhận từ người bệnh.'}</p>
 <div class="button-row">${btn('Xác nhận hoàn tất · mô phỏng', 'complete', t.id, done || !!t.blockers.length)}${t.kind !== 'consult' ? btn(t.result ? 'Phát hành mẫu phiên bản mới' : 'Phát hành kết quả mẫu', 'result', t.id, !done, 'secondary') : ''}</div>
 ${!done && t.blockers.length ? `<p class="caption">${escape(t.blockers.join(' · '))}</p>` : ''}
 <details><summary>Điều phối phòng và hàng đợi</summary><p class="caption">Ước tính tới lượt: ${t.waitMinutes + t.waitingCount * t.averageServiceMinutes} phút (${t.waitingCount} người đợi, trung bình ${t.averageServiceMinutes} phút/người).</p><form data-form="configure" data-task="${t.id}" class="config-form"><div class="form-grid"><label>Phòng<input name="room" value="${escape(t.room)}" required maxlength="40"></label><label>Tầng<input name="floor" value="${escape(t.floor)}" required maxlength="60"></label><label>Chờ dự kiến (phút)<input name="waitMinutes" type="number" min="0" max="240" value="${t.waitMinutes}" required></label><label>Người đang đợi<input name="waitingCount" type="number" min="0" max="999" value="${t.waitingCount}" required></label><label>Thời gian làm trung bình (phút)<input name="averageServiceMinutes" type="number" min="1" max="240" value="${t.averageServiceMinutes}" required></label><label>Ưu tiên (dùng khi bằng nhau)<input name="priority" type="number" min="1" max="99" value="${t.priority}" required></label></div><label class="checkbox"><input name="available" type="checkbox" ${t.available ? 'checked' : ''}> Phòng sẵn sàng</label><label>Chỉ dẫn (mỗi dòng một bước)<textarea name="directions" rows="3" required>${escape(t.directions.join('\n'))}</textarea></label><button class="button secondary" type="submit">Lưu điều phối</button></form></details>
 ${t.result ? `<details><summary>Phiếu nguồn và sửa kết quả giả lập</summary>${sourceCard(t)}<form data-form="edit-result" data-task="${t.id}"><label>JSON phiếu nguồn (chỉ dữ liệu giả lập)<textarea class="code-input" name="result" rows="12" required>${escape(JSON.stringify({ source: t.result.source, readings: t.result.readings, report: t.result.report }, null, 2))}</textarea></label><button class="button secondary" type="submit">Phát hành bản sửa · hủy duyệt cũ</button></form></details>` : ''}</article>`;
}
function staffPage() {
 const s = visit.summary;
 return `<div class="staff-layout"><section><div class="section-heading"><h2>01 / Điều phối dịch vụ</h2>${badge('Tất cả thao tác là mô phỏng', 'warning')}</div>${visit.tasks.map(staffTask).join('')}</section><section><div class="section-heading"><h2>02 / Tổng hợp và duyệt</h2>${badge('AI hỗ trợ soạn')}</div><div class="review-card"><p>Chỉ tổng hợp phiếu nguồn đã phát hành. Điều phối phòng dùng quy tắc, không do AI quyết định.</p><div class="button-row">${btn('Soạn bản nháp mẫu', 'draft-demo', '', !visit.tasks.some(t => t.result))}${btn('Soạn bằng AI thật', 'draft-live', '', !config.liveAvailable || !visit.tasks.some(t => t.result) || busy, 'secondary')}</div><p class="caption">${config.liveAvailable ? 'Đã cấu hình AI thật. Chỉ gửi dữ liệu giả lập khi bấm nút AI thật.' : 'AI thật chưa cấu hình. Bản nháp mẫu không gọi API.'} ${visit.generationId ? 'Đang soạn…' : ''}</p>
<p>Siêu âm Sản khoa là phần ưu tiên AI. Xét nghiệm dùng diễn giải theo nguồn/cờ; mọi nhận định đều là bản nháp để bác sĩ đối chiếu và duyệt.</p><div class="button-row">${btn('Soạn bản nháp mẫu', 'draft-demo', '', !visit.tasks.some(t => t.result))}${btn('Soạn bằng AI thật', 'draft-live', '', !config.liveAvailable || !visit.tasks.some(t => t.result) || busy, 'secondary')}</div><p class="caption">${config.liveAvailable ? 'Đã cấu hình AI thật. Chỉ gửi dữ liệu giả lập khi bấm nút AI thật.' : 'AI thật chưa cấu hình. Bản nháp mẫu không gọi API.'} ${visit.generationId ? 'Đang soạn…' : ''}</p>
 ${s ? `<div class="section-heading"><h3>${s.status === 'approved' ? 'Đã duyệt · MÔ PHỎNG' : s.status === 'rejected' ? 'Bản nháp đã bị từ chối' : 'Bản nháp chờ duyệt'}</h3>${badge(s.mode === 'demo' ? 'Mẫu tạo sẵn' : 'AI thật')}</div><form data-form="review" data-draft="${s.id}">${s.sections.map(x => {
 const task = visit.tasks.find(t => t.result?.id === x.resultId);
 return `<div class="review-item">${task ? sourceCard(task) : ''}<p><strong>Nhận định hỗ trợ:</strong> ${escape(x.assessment || 'Chưa có nhận định riêng.')} ${x.confidence ? `<small>· mức ${escape(x.confidence)}</small>` : ''}</p><input type="hidden" name="assessment:${escape(x.resultId)}" value="${escape(x.assessment || '')}"><input type="hidden" name="confidence:${escape(x.resultId)}" value="${escape(x.confidence || '')}"><label>Giải thích cho người bệnh<textarea name="${escape(x.resultId)}" rows="5" maxlength="1000" ${s.status !== 'draft' ? 'readonly' : ''} required>${escape(x.explanation)}</textarea></label></div>`;
 }).join('')}<p class="caption">Giữ số liệu ở phiếu gốc; giải thích không chứa chữ số hay khuyến nghị điều trị. Bác sĩ mô phỏng cần đọc và kiểm tra nội dung.</p>${s.status === 'draft' ? `<div class="button-row"><button class="button" type="submit">Duyệt & gửi · mô phỏng</button>${btn('Từ chối bản nháp', 'reject', '', false, 'secondary')}</div>` : ''}</form>` : '<div class="empty-state">Chưa có bản nháp. Phát hành ít nhất một phiếu nguồn rồi chọn soạn.</div>'}</div>
 <section class="event-log"><h2>03 / Nhật ký phiên</h2>${visit.events.length ? visit.events.slice(0, 12).map(e => `<div><time>${new Date(e.at).toLocaleTimeString('vi-VN')}</time><p>${escape(e.detail)}</p></div>`).join('') : '<p>Chưa có thao tác.</p>'}</section></section></div>`;
}
function render() {
 document.querySelector('#role-link').href = sessionUrl(staff ? '/patient' : '/staff');
 document.querySelector('#role-link').textContent = staff ? 'Mở giao diện người bệnh ↗' : 'Màn hình nhân viên ↗';
 document.querySelector('#role-link').target = '_blank';
 app.innerHTML = header() + (staff ? '' : `<nav class="tabs" aria-label="Nội dung lượt khám">${[['journey', 'route', 'Hành trình'], ['results', 'result', 'Kết quả'], ['help', 'help', 'Hỗ trợ']].map(([id, ico, label]) => `<button data-tab="${id}" class="${tab === id ? 'selected' : ''}" aria-current="${tab === id ? 'page' : 'false'}">${icon(ico)}${label}</button>`).join('')}</nav>`) + (staff ? staffPage() : tab === 'journey' ? journey() : tab === 'results' ? resultsPage() : helpPage()) + `<div class="bottom-tools"><span>Phiên được khôi phục khi mở lại cùng trình duyệt.</span><button class="text-button" data-action="reset">Đặt lại demo ↻</button></div>${confirmingReset ? '<section class="reset-confirm" role="region" aria-label="Xác nhận đặt lại"><h3>Đặt lại phiên demo này?</h3><p>Tiến độ, kết quả và bản duyệt giả lập của phiên hiện tại sẽ được xóa. Mã phiên được giữ để hai tab tiếp tục đồng bộ.</p><div class="button-row"><button class="button" data-action="confirm-reset">Xác nhận đặt lại</button><button class="button secondary" data-action="cancel-reset">Giữ phiên hiện tại</button></div></section>' : ''}`;
}
async function refresh(force = false) {
 if (!visit) return;
 const newer = await api(`visits/${visit.id}`);
 if (force || newer.revision !== visit.revision) { visit = newer; render(); }
}
async function mutate(action, data = {}, message = 'Đã cập nhật.') {
 if (busy) return;
 busy = true;
 app.setAttribute('aria-busy', 'true');
 try { visit = await api(`visits/${visit.id}/${action}`, { expectedRevision: visit.revision, ...data }); render(); notify(message); }
 catch (error) { if (error.status === 409) await refresh(true); notify(error.message, true); }
 finally { busy = false; app.removeAttribute('aria-busy'); }
}
app.addEventListener('click', async event => {
 const nav = event.target.closest('[data-tab]');
 if (nav) { tab = nav.dataset.tab; render(); return; }
 const button = event.target.closest('[data-action]');
 if (!button || busy) return;
 const action = button.dataset.action, taskId = button.dataset.task;
 if (action === 'reset') {
   confirmingReset = true; render(); app.querySelector('[data-action="confirm-reset"]').focus();
 } else if (action === 'cancel-reset') { confirmingReset = false; render();
 } else if (action === 'confirm-reset') { confirmingReset = false; await mutate('reset', {}, 'Đã đặt lại demo.');
 } else if (action.startsWith('draft-')) {
   notify('Đang soạn bản nháp…');
   await mutate('draft', { mode: action === 'draft-live' ? 'live' : 'demo' }, 'Bản nháp đã sẵn sàng để kiểm tra.');
 } else if (action === 'reject') await mutate('review', { draftId: visit.summary.id, action: 'reject' }, 'Đã từ chối; bản nháp không được gửi người bệnh.');
 else if (action === 'help') await mutate('help', {}, 'Đã ghi yêu cầu trong demo. Chưa có nhân viên thật nhận yêu cầu.');
 else await mutate(action, { taskId }, action === 'patient-confirm' ? 'Đã ghi nhận. Chờ nhân viên xác nhận hoàn tất dịch vụ.' : 'Đã cập nhật mô phỏng.');
});
app.addEventListener('submit', async event => {
 event.preventDefault();
 const form = event.target, values = Object.fromEntries(new FormData(form));
 if (form.dataset.form === 'configure') await mutate('configure', { taskId: form.dataset.task, ...values, available: form.elements.available.checked, waitMinutes: Number(values.waitMinutes), waitingCount: Number(values.waitingCount), averageServiceMinutes: Number(values.averageServiceMinutes), priority: Number(values.priority) });
 else if (form.dataset.form === 'edit-result') {
   try { await mutate('result', { taskId: form.dataset.task, result: JSON.parse(values.result) }, 'Nguồn đã đổi; cần soạn và duyệt lại giải thích.'); }
   catch { notify('JSON chưa hợp lệ. Kiểm tra nội dung phiếu.', true); }
 } else if (form.dataset.form === 'review') await mutate('review', { draftId: form.dataset.draft, action: 'approve', sections: visit.summary.sections.map(section => ({ resultId: section.resultId, assessment: values[`assessment:${section.resultId}`] || '', confidence: values[`confidence:${section.resultId}`] || '', explanation: values[section.resultId] })) }, 'Đã duyệt mô phỏng; người bệnh có thể xem giải thích.');
});
async function init() {
 config = await api('config');
 let id = new URLSearchParams(location.search).get('visit') || localStorage.getItem('nhip-kham-visit');
 if (id) {
   try { visit = await api(`visits/${id}`); }
   catch (error) {
     if (error.status !== 404) throw error;
     notify('Phiên cũ không còn trên máy chủ. Đã tạo một phiên demo mới.');
   }
 }
 if (!visit) visit = await api('visits', {});
 localStorage.setItem('nhip-kham-visit', visit.id);
 history.replaceState(null, '', sessionUrl(staff ? '/staff' : '/patient'));
 render();
 setInterval(() => { if (!busy && !document.activeElement?.closest('form')) refresh().catch(() => notify('Mất kết nối. Tiến độ đã lưu trên máy chủ; thử tải lại.', true)); }, 2500);
}
init().catch(error => { app.innerHTML = `<section class="help-page"><h1>Chưa mở được phiên</h1><p>${escape(error.message)}</p><a class="button" href="/patient">Thử mở lại</a></section>`; });
