import { networkInterfaces } from 'node:os';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createApp } from './server.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));

export function chooseLanAddress(interfaces, preferred = '') {
  const candidates = Object.entries(interfaces).flatMap(([name, addresses]) => (addresses ?? [])
    .filter(a => (a.family === 'IPv4' || a.family === 4) && !a.internal && /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(a.address))
    .map(a => ({ name, address: a.address })));
  if (preferred) {
    if (!candidates.some(a => a.address === preferred)) throw new Error('LAN_IP phải là địa chỉ IPv4 nội bộ hiện có của máy này.');
    return preferred;
  }
  const physical = candidates.filter(a => !/vmware|virtual|vethernet|hyper|docker|vpn|wsl/i.test(a.name));
  physical.sort((a, b) => Number(/wi-?fi|wlan|wireless/i.test(b.name)) - Number(/wi-?fi|wlan|wireless/i.test(a.name)));
  if (!physical.length) throw new Error('Chưa tìm thấy card Wi-Fi/Ethernet có IP nội bộ. Kết nối Wi-Fi hoặc đặt LAN_IP theo ipconfig.');
  return physical[0].address;
}
export function renderGuide(template, baseUrl, sessions) {
  const cards = Object.entries(sessions).map(([label, id]) => `<tr><th>${label}</th><td><a href="${baseUrl}/patient?visit=${id}" target="_blank" rel="noopener">Mở người bệnh ${label}</a></td><td><a href="${baseUrl}/staff?visit=${id}" target="_blank" rel="noopener">Mở nhân viên/bác sĩ ${label}</a></td></tr>`).join('\n');
  return template.replaceAll('{{BASE_URL}}', baseUrl).replace('{{SESSION_LINKS}}', cards);
}
export async function startPhoneDemo(config = process.env) {
  const host = chooseLanAddress(networkInterfaces(), config.LAN_IP || '');
  const port = Number(config.LAN_PORT || 4174);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('LAN_PORT cần nằm trong 1024–65535.');
  const local = path.join(here, '.local'); mkdirSync(local, { recursive: true });
  const guideFile = path.join(local, 'phone-links.html');
  const server = createApp({ dataFile: path.join(local, 'phone-visits.json'), guideFile, config });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); });
  const baseUrl = `http://${host}:${port}`;
  const sessionFile = path.join(local, 'phone-session-ids.json');
  let oldSessions = {};
  if (existsSync(sessionFile)) { try { oldSessions = JSON.parse(readFileSync(sessionFile, 'utf8')); } catch { /* Rebuild links, retain visit storage. */ } }
  const sessions = {};
  try {
    for (const label of ['T1', 'T2', 'T3']) {
      const id = oldSessions[label];
      if (typeof id === 'string' && /^[a-f\d-]{36}$/i.test(id)) {
        const found = await fetch(`${baseUrl}/api/visits/${id}`, { signal: AbortSignal.timeout(5000) });
        if (found.ok) { sessions[label] = id; continue; }
      }
      const result = await fetch(`${baseUrl}/api/visits`, { method: 'POST', signal: AbortSignal.timeout(5000) });
      if (!result.ok) throw new Error('Không tạo được phiên mẫu; kiểm tra quyền ghi .local.');
      sessions[label] = (await result.json()).id;
    }
    writeFileSync(sessionFile, JSON.stringify(sessions, null, 2));
    const template = readFileSync(path.join(here, 'public', 'test-guide-template.html'), 'utf8');
    writeFileSync(guideFile, renderGuide(template, baseUrl, sessions));
  } catch (error) { server.close(); throw error; }
  console.log(`\nNHỊP KHÁM · THỬ QUA ĐIỆN THOẠI\nHướng dẫn và phiên T1–T3: ${baseUrl}/test-guide\nĐiện thoại và máy tính cần cùng Wi-Fi. Giữ cửa sổ này chạy; Ctrl+C để dừng.\n`);
  for (const [label, id] of Object.entries(sessions)) console.log(`${label} người bệnh: ${baseUrl}/patient?visit=${id}\n${label} nhân viên:  ${baseUrl}/staff?visit=${id}\n`);
  console.log(`File link: ${guideFile}\nChỉ dữ liệu giả lập. Người có link trên mạng nội bộ có thể mở cả hai vai.\n`);
  return { server, baseUrl, sessions, guideFile };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  startPhoneDemo().catch(error => { console.error(`Không mở được demo điện thoại: ${error.message}\nNếu cổng bận, dùng lại link đang chạy hoặc đặt LAN_PORT khác.`); process.exitCode = 1; });
}
