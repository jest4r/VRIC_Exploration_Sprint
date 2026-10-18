import http from 'node:http';
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createVisit, Problem, check, assertRevision, confirmPatient, completeService, configureTask, publishResult, startDraft, finishDraft, reviewDraft, record, viewVisit } from './lib/domain.mjs';
import { generateSections } from './lib/ai.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
async function body(req) {
  let size = 0, chunks = [];
  for await (const chunk of req) { size += chunk.length; check(size <= 32768, 'Yêu cầu quá lớn.', 413); chunks.push(chunk); }
  try { const value = JSON.parse(Buffer.concat(chunks).toString() || '{}'); check(value && typeof value === 'object' && !Array.isArray(value), 'Yêu cầu cần là đối tượng JSON.'); return value; } catch { throw new Problem('JSON không hợp lệ.'); }
}
export function createApp({ dataFile = null, config = process.env, generate = generateSections, guideFile = null } = {}) {
  let visits = new Map();
  if (dataFile && existsSync(dataFile)) {
    const saved = JSON.parse(readFileSync(dataFile, 'utf8'));
    visits = new Map(saved.map(v => { v.generationId = null; return [v.id, v]; }));
  }
  function save() {
    if (!dataFile) return;
    mkdirSync(path.dirname(dataFile), { recursive: true });
    writeFileSync(`${dataFile}.tmp`, JSON.stringify([...visits.values()], null, 2));
    renameSync(`${dataFile}.tmp`, dataFile);
  }
  return http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    const json = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(value)); };
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname.startsWith('/api/')) {
        // Explicit simulation role selector; this is NOT authentication.
        const origin = req.headers.origin;
        if (req.method !== 'GET' && origin) check(origin === `http://${req.headers.host}`, 'Nguồn yêu cầu không hợp lệ.', 403);
        if (url.pathname === '/api/config' && req.method === 'GET') return json(200, { liveAvailable: Boolean(config.OPENAI_API_KEY && config.OPENAI_MODEL) });
        if (url.pathname === '/api/visits' && req.method === 'POST') {
          check(visits.size < 200, 'Demo đã đạt giới hạn phiên cục bộ.', 429);
          const visit = createVisit(); visits.set(visit.id, visit); save(); return json(201, viewVisit(visit));
        }
        const match = url.pathname.match(/^\/api\/visits\/([a-f\d-]{36})(?:\/(patient-confirm|complete|configure|result|draft|review|help|reset))?$/i);
        check(match, 'Không có API này.', 404);
        const visit = visits.get(match[1]); check(visit, 'Phiên không tồn tại trên máy chủ này.', 404);
        const role = req.headers['x-demo-role'] === 'staff' ? 'staff' : 'patient';
        const action = match[2];
        if (!action && req.method === 'GET') return json(200, viewVisit(visit, role));
        check(req.method === 'POST' && action, 'Phương thức không hợp lệ.', 405);
        const data = await body(req); assertRevision(visit, data.expectedRevision);
        if (['complete', 'configure', 'result', 'draft', 'review'].includes(action)) check(role === 'staff', 'Dùng màn hình nhân viên mô phỏng để thực hiện thao tác này.', 403);
        switch (action) {
          case 'patient-confirm': confirmPatient(visit, data.taskId); break;
          case 'complete': completeService(visit, data.taskId); break;
          case 'configure': configureTask(visit, data.taskId, data); break;
          case 'result': {
            publishResult(visit, data.taskId, data.result);
            const pending = startDraft(visit);
            finishDraft(visit, pending, await generateSections(pending.results, 'demo'), 'demo');
            break;
          }
          case 'review': reviewDraft(visit, data); break;
          case 'help': record(visit, 'help', 'Người bệnh yêu cầu hỗ trợ trực tiếp trong demo; chưa có nhân viên thật nhận yêu cầu.'); break;
          case 'reset': {
            const fresh = createVisit(); fresh.id = visit.id; fresh.revision = visit.revision + 1;
            visits.set(visit.id, fresh); save(); return json(200, viewVisit(fresh, role));
          }
          case 'draft': {
            const pending = startDraft(visit); save();
            try {
              const sections = await generate(pending.results, data.mode, config);
              check(visits.get(visit.id) === visit, 'Phiên đã đặt lại khi AI đang soạn.', 409);
              finishDraft(visit, pending, sections, data.mode);
            } catch (error) {
              if (visits.get(visit.id) === visit && visit.generationId === pending.token) {
                visit.generationId = null; record(visit, 'draft-error', 'Tạo bản nháp thất bại; không tự chuyển sang dữ liệu mô phỏng.'); save();
              }
              throw error;
            }
            break;
          }
        }
        save(); return json(200, viewVisit(visit, role));
      }
      check(req.method === 'GET' || req.method === 'HEAD', 'Phương thức không hợp lệ.', 405);
      if (url.pathname === '/test-guide' && guideFile && existsSync(guideFile)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(req.method === 'HEAD' ? undefined : readFileSync(guideFile));
        return;
      }
      const files = { '/': ['index.html', 'text/html'], '/patient': ['index.html', 'text/html'], '/staff': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/styles.css': ['styles.css', 'text/css'], '/guide.css': ['guide.css', 'text/css'] };
      const asset = files[url.pathname]; check(asset, 'Không tìm thấy trang.', 404);
      res.writeHead(200, { 'Content-Type': `${asset[1]}; charset=utf-8` });
      res.end(req.method === 'HEAD' ? undefined : readFileSync(path.join(here, 'public', asset[0])));
    } catch (error) { if (!(error instanceof Problem)) console.error('Local server error:', error.code || error.name, error.message); json(error instanceof Problem ? error.status : 500, { error: error instanceof Problem ? error.message : 'Lỗi máy chủ cục bộ; thử tải lại.' }); }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const server = createApp({ dataFile: path.join(here, '.local', 'visits.json') });
  server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`Nhịp khám: http://127.0.0.1:${server.address().port} (demo cục bộ)`));
}
