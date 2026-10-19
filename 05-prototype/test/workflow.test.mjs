import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createVisit, completeService, confirmPatient, configureTask, publishResult, sampleResult, route, sources, startDraft, finishDraft, reviewDraft, viewVisit, validateSections } from '../lib/domain.mjs';
import { generateSections } from '../lib/ai.mjs';
import { createApp } from '../server.mjs';

function performed() { const v = createVisit(); completeService(v, 'blood'); completeService(v, 'imaging'); return v; }
async function draft(v) { const p = startDraft(v); finishDraft(v, p, await generateSections(p.results, 'demo'), 'demo'); return v.summary; }
function approve(v) { reviewDraft(v, { action: 'approve', draftId: v.summary.id, sections: v.summary.sections }); }
function configure(v, id, overrides) {
 const t = v.tasks.find(t => t.id === id);
 configureTask(v, id, { ...t, directions: t.directions.join('\n'), ...overrides });
}

test('patient tick is separate; service completion permits next room while result is pending', () => {
 const v = createVisit(); assert.equal(route(v), 'blood');
 confirmPatient(v, 'blood'); assert.equal(v.tasks[0].service, 'pending'); assert.equal(route(v), 'blood');
 completeService(v, 'blood'); assert.equal(route(v), 'imaging'); assert.equal(v.tasks[0].result, null);
 assert.throws(() => completeService(v, 'consult'), /điều kiện/);
});

test('synthetic obstetric profile prioritizes ultrasound measurements and keeps result-specific assessment', async () => {
 const v = performed();
 assert.deepEqual(v.patient, { name: 'Trần Đức Đăng Khôi', specialty: 'Sản khoa', synthetic: true });
 publishResult(v, 'imaging');
 const ultrasound = v.tasks.find(t => t.id === 'imaging').result;
 assert.deepEqual(ultrasound.readings.map(reading => reading.name), ['CRL', 'NT', 'Tim thai', 'Tuổi thai theo siêu âm']);
 const sections = await generateSections(sources(v), 'demo');
 assert.equal(sections[0].assessment.includes('bác sĩ'), true);
 assert.equal(sections[0].confidence, 'thấp');
 finishDraft(v, startDraft(v), sections, 'demo');
 assert.equal(viewVisit(v).summary, null);
 assert.equal(viewVisit(v, 'staff').summary.sections[0].assessment, sections[0].assessment);
});
test('blocked rooms, priorities and changed directions are respected', () => {
 const v = createVisit(); configure(v, 'blood', { available: false }); assert.equal(route(v), null);
 configure(v, 'blood', { available: true, room: 'A99', directions: 'Tới quầy\nRẽ phải' });
 assert.equal(route(v), 'blood'); assert.deepEqual(v.tasks[0].directions, ['Tới quầy', 'Rẽ phải']);
 assert.throws(() => configure(v, 'blood', { waitMinutes: -1 }));
 // Independent services use configured priority, rather than an LLM decision.
 v.tasks[1].dependencies = []; configure(v, 'imaging', { priority: 1, waitMinutes: 1 });
 assert.equal(route(v), 'imaging');
});
test('out-of-order result publication and idempotent actions; consultation waits for both results', () => {
 const v = performed(); const rev = v.revision; completeService(v, 'imaging'); assert.equal(v.revision, rev);
 publishResult(v, 'imaging'); assert.equal(route(v), null);
 publishResult(v, 'blood'); assert.equal(route(v), 'consult');
 completeService(v, 'consult'); assert.equal(viewVisit(v).completed, true);
 assert.equal(viewVisit(v).nextTaskId, null);
});
test('no source, empty source and premature result cannot create draft', () => {
 const v = createVisit(); assert.throws(() => startDraft(v)); assert.throws(() => publishResult(v, 'blood'));
 completeService(v, 'blood'); assert.throws(() => publishResult(v, 'blood', { source: 'mock', readings: [], report: '' }));
});
test('draft hidden from patient API shape; approval exposes only current source version', async () => {
 const v = performed(); publishResult(v, 'blood'); await draft(v);
 assert.equal(viewVisit(v).summary, null); assert.deepEqual(viewVisit(v).events, []);
 assert.ok(viewVisit(v, 'staff').summary);
 approve(v); assert.equal(viewVisit(v).summary.status, 'approved');
 const staleId = v.summary.id; publishResult(v, 'blood');
 assert.equal(viewVisit(v).summary, null);
 assert.throws(() => reviewDraft(v, { action: 'approve', draftId: staleId, sections: [] }));
});
test('source change/new request cancels late AI response', async () => {
 const v = performed(); publishResult(v, 'blood'); const pending = startDraft(v);
 publishResult(v, 'imaging'); assert.throws(() => finishDraft(v, pending, [], 'demo'), /thay đổi/);
 const a = startDraft(v), b = startDraft(v);
 assert.throws(() => finishDraft(v, a, [], 'demo'));
 finishDraft(v, b, await generateSections(b.results, 'demo'), 'demo'); assert.equal(v.summary.sourceVersion, v.sourceVersion);
});
test('rejected draft remains invisible; edited explanations keep original values/units/flags intact', async () => {
 const v = performed(); publishResult(v, 'blood'); const originals = structuredClone(sources(v));
 await draft(v); reviewDraft(v, { action: 'reject', draftId: v.summary.id }); assert.equal(viewVisit(v).summary, null);
 await draft(v); v.summary.sections[0].explanation = 'Bản giải thích đã chỉnh sửa. Ý nghĩa chuyên môn cần bác sĩ xác nhận.'; approve(v);
 assert.deepEqual(sources(v), originals);
 assert.equal(viewVisit(v).tasks[0].result.readings[0].value, '6.2');
 assert.equal(viewVisit(v).tasks[0].result.readings[0].unit, 'mmol/L');
 assert.equal(viewVisit(v).tasks[0].result.readings[0].flag, 'H');
});
test('invalid source links, numeric inventions and overt treatment suggestions rejected', () => {
 const v = performed(); publishResult(v, 'blood'); const input = sources(v);
 for (const section of [
   { resultId: 'invented', explanation: 'Giải thích không có nguồn.' },
   { resultId: 'blood-result', explanation: 'Giá trị mới là 99.' },
   { resultId: 'blood-result', explanation: 'Bạn nên uống thuốc mỗi ngày.' }
 ]) assert.throws(() => validateSections([section], input));
});

test('AI adapter handles missing config, HTTP errors, refusal, malformed/incomplete and schema-invalid output', async () => {
 const v = performed(); publishResult(v, 'blood'); const input = sources(v), cfg = { OPENAI_API_KEY: 'test-only-not-real', OPENAI_MODEL: 'test-model' };
 await assert.rejects(generateSections(input, 'live', {}), /Chưa cấu hình/);
 await assert.rejects(generateSections(input, 'live', cfg, async () => { throw new Error('offline'); }), /Không kết nối/);
 await assert.rejects(generateSections(input, 'live', cfg, async () => ({ ok: false, status: 429 })), /429/);
 const respond = data => async () => ({ ok: true, json: async () => data });
 await assert.rejects(generateSections(input, 'live', cfg, respond({ status: 'incomplete' })), /chưa hoàn tất/);
 await assert.rejects(generateSections(input, 'live', cfg, respond({ status: 'completed', output: [{ type: 'message', content: [{ type: 'refusal' }] }] })), /từ chối/);
 for (const text of ['bad json', JSON.stringify({ sections: [] })]) {
   await assert.rejects(generateSections(input, 'live', cfg, respond({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text }] }] })));
 }
});
test('live adapter uses strict schema, no provider-side response storage, validates returned sections', async () => {
 const v = performed(); publishResult(v, 'blood'); const input = sources(v);
 const sections = await generateSections(input, 'demo'); let request;
 const actual = await generateSections(input, 'live', { OPENAI_API_KEY: 'test-only', OPENAI_MODEL: 'test-model' }, async (url, options) => {
   request = JSON.parse(options.body); assert.equal(url, 'https://api.openai.com/v1/responses');
   return { ok: true, json: async () => ({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({ sections }) }] }] }) };
 });
 assert.equal(request.store, false); assert.equal(request.text.format.strict, true); assert.deepEqual(actual, sections);
});

async function fixture(t, options = {}) {
 const server = createApp(options); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 t.after(() => new Promise(resolve => server.close(resolve)));
 const url = `http://127.0.0.1:${server.address().port}`;
 async function call(endpoint, data, role = 'staff') {
   const res = await fetch(`${url}/api/${endpoint}`, { method: data ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', 'X-Demo-Role': role }, ...(data ? { body: JSON.stringify(data) } : {}) });
   return { status: res.status, data: await res.json() };
 }
 return { call, url };
}
test('HTTP full journey: auto draft, patient isolation, stale edits, approval invalidation and help', async t => {
 const { call, url } = await fixture(t, { config: {} });
 let { data: v } = await call('visits', {});
 const action = async (name, input = {}, role = 'staff') => {
   const res = await call(`visits/${v.id}/${name}`, { expectedRevision: v.revision, ...input }, role);
   if (res.status === 200) v = res.data; return res;
 };
 assert.equal((await action('complete', { taskId: 'blood' }, 'patient')).status, 403);
 await action('patient-confirm', { taskId: 'blood' }, 'patient'); assert.equal(v.tasks[0].service, 'pending');
 await action('complete', { taskId: 'blood' }); assert.equal(v.nextTaskId, 'imaging');
 await action('complete', { taskId: 'imaging' }); await action('result', { taskId: 'imaging' });
 assert.equal(v.summary.status, 'draft'); assert.equal(v.nextTaskId, null);
 const patient = await call(`visits/${v.id}`, null, 'patient'); assert.equal(patient.data.summary, null);
 const stale = v.revision; await action('result', { taskId: 'blood' });
 assert.equal((await call(`visits/${v.id}/help`, { expectedRevision: stale }, 'patient')).status, 409);
 await action('review', { draftId: v.summary.id, action: 'approve', sections: v.summary.sections });
 assert.equal((await call(`visits/${v.id}`, null, 'patient')).data.summary.status, 'approved');
 await action('result', { taskId: 'blood' }); assert.equal((await call(`visits/${v.id}`, null, 'patient')).data.summary, null);
 const id = v.id; await action('help', {}, 'patient'); await action('complete', { taskId: 'consult' }); assert.equal(v.completed, true);
 await action('reset', {}, 'patient'); assert.equal(v.id, id); assert.equal(v.tasks[0].service, 'pending');
 for (const endpoint of ['/patient', '/staff', '/styles.css', '/app.js']) assert.equal((await fetch(url + endpoint)).status, 200);
 for (const endpoint of ['/.env', '/server.mjs', '/.local/visits.json']) assert.equal((await fetch(url + endpoint)).status, 404);
});
test('HTTP persistence restores session after server restart', async t => {
 const dir = mkdtempSync(path.join(tmpdir(), 'nhip-kham-')); t.after(() => rmSync(dir, { recursive: true, force: true }));
 const file = path.join(dir, 'visits.json');
 const first = await fixture(t, { dataFile: file });
 const { data: v } = await first.call('visits', {});
 await first.call(`visits/${v.id}/complete`, { expectedRevision: v.revision, taskId: 'blood' });
 const second = await fixture(t, { dataFile: file });
 const restored = await second.call(`visits/${v.id}`); assert.equal(restored.data.tasks[0].service, 'performed');
});
test('HTTP failed live generation preserves sources and never silently changes to demo', async t => {
 const { call } = await fixture(t, { config: {} }); let { data: v } = await call('visits', {});
 for (const [name, input] of [['complete', { taskId: 'blood' }], ['result', { taskId: 'blood' }]]) {
   v = (await call(`visits/${v.id}/${name}`, { expectedRevision: v.revision, ...input })).data;
 }
 const res = await call(`visits/${v.id}/draft`, { expectedRevision: v.revision, mode: 'live' }); assert.equal(res.status, 503);
 const after = (await call(`visits/${v.id}`)).data;
 assert.equal(after.tasks[0].result.readings[0].value, '6.2'); assert.equal(after.summary.id, v.summary.id);
 assert.equal(after.generationId, null);
});
test('HTTP reset or changed source prevents an in-flight AI response from publishing', async t => {
 let release; let entered;
 const started = new Promise(resolve => { entered = resolve; });
 const { call } = await fixture(t, { generate: async results => { entered(); await new Promise(resolve => { release = resolve; }); return generateSections(results, 'demo'); } });
 let { data: v } = await call('visits', {});
 for (const [name, input] of [['complete', { taskId: 'blood' }], ['result', { taskId: 'blood' }]]) v = (await call(`visits/${v.id}/${name}`, { expectedRevision: v.revision, ...input })).data;
 const pending = call(`visits/${v.id}/draft`, { expectedRevision: v.revision, mode: 'demo' }); await started;
 v = (await call(`visits/${v.id}`)).data;
 await call(`visits/${v.id}/reset`, { expectedRevision: v.revision }); release();
 assert.equal((await pending).status, 409);
 assert.equal((await call(`visits/${v.id}`)).data.summary, null);
});
