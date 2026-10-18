import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { chooseLanAddress, renderGuide } from '../phone-server.mjs';
import { createApp } from '../server.mjs';

test('phone launcher selects physical Wi-Fi and excludes virtual and link-local adapters', () => {
 const interfaces = {
   'VMware Network Adapter': [{ family: 'IPv4', internal: false, address: '192.168.46.1' }],
   'Ethernet': [{ family: 'IPv4', internal: false, address: '10.0.0.2' }],
   'Wi-Fi': [{ family: 'IPv4', internal: false, address: '192.168.1.84' }],
   'Loopback': [{ family: 'IPv4', internal: true, address: '127.0.0.1' }]
 };
 assert.equal(chooseLanAddress(interfaces), '192.168.1.84');
 assert.equal(chooseLanAddress(interfaces, '10.0.0.2'), '10.0.0.2');
 assert.throws(() => chooseLanAddress(interfaces, '203.0.113.9'));
 assert.throws(() => chooseLanAddress({ 'Wi-Fi': [{ family: 'IPv4', internal: false, address: '169.254.1.2' }] }));
});
test('phone guide pairs both roles with the same ID and keeps participants separate', () => {
 const html = renderGuide('<a href="{{BASE_URL}}">Guide</a><table>{{SESSION_LINKS}}</table>', 'http://192.168.1.84:4174', { T1: 'one', T2: 'two', T3: 'three' });
 assert.equal((html.match(/visit=one/g) || []).length, 2);
 assert.equal((html.match(/visit=two/g) || []).length, 2);
 assert.equal((html.match(/visit=three/g) || []).length, 2);
 assert.ok(html.includes('/patient?visit=one') && html.includes('/staff?visit=one'));
 assert.ok(!html.includes('{{'));
});
async function serverFixture(t, options) {
 const server = createApp(options); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 t.after(() => new Promise(resolve => server.close(resolve)));
 return `http://127.0.0.1:${server.address().port}`;
}
test('guide is served only with an explicit configured file; same-origin requests work and cross-origin requests fail', async t => {
 const dir = mkdtempSync(path.join(tmpdir(), 'nhip-guide-'));
 t.after(() => rmSync(dir, { recursive: true, force: true }));
 const guideFile = path.join(dir, 'guide.html'); writeFileSync(guideFile, '<h1>Guide test</h1>');
 const url = await serverFixture(t, { guideFile });
 assert.equal(await (await fetch(url+'/test-guide')).text(), '<h1>Guide test</h1>');
 assert.equal((await fetch(url+'/guide.css')).status, 200);
 assert.equal((await fetch(url+'/api/visits', { method: 'POST', headers: { Origin: url } })).status, 201);
 assert.equal((await fetch(url+'/api/visits', { method: 'POST', headers: { Origin: 'http://other.invalid' } })).status, 403);
 const defaultUrl = await serverFixture(t, {});
 assert.equal((await fetch(defaultUrl+'/test-guide')).status, 404);
});
test('separate participant sessions do not share progress', async t => {
 const url = await serverFixture(t, {});
 const create = async () => (await fetch(url+'/api/visits', { method: 'POST' })).json();
 const a = await create(), b = await create(), c = await create();
 assert.equal(new Set([a.id,b.id,c.id]).size, 3);
 const result = await fetch(`${url}/api/visits/${a.id}/complete`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Demo-Role': 'staff' }, body: JSON.stringify({ taskId: 'blood', expectedRevision: a.revision }) });
 assert.equal(result.status, 200);
 for (const id of [b.id,c.id]) {
   const other = await (await fetch(`${url}/api/visits/${id}`)).json();
   assert.equal(other.tasks[0].service, 'pending'); assert.equal(other.revision, 0);
 }
});
