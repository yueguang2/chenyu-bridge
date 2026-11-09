// 提交前资源预检的单测（用本地假 ComfyUI，验证白名单校验与相近候选）。
import { test } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

import { preflightWorkflow } from '../lib.mjs';

function serve(routes) {
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const p = new URL(req.url, 'http://x').pathname;
      const h = routes[p];
      if (h) { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(h)); }
      else { res.writeHead(404, { 'content-type': 'application/json' }); res.end('{}'); }
    });
    s.listen(0, '127.0.0.1', () => resolve({ s, base: 'http://127.0.0.1:' + s.address().port }));
  });
}

test('preflight：值在白名单内则通过', async () => {
  const { s, base } = await serve({
    '/object_info/LoraLoaderModelOnly': { LoraLoaderModelOnly: { input: { required: { lora_name: [['MOSS/a.safetensors']] } } } },
  });
  const wf = { '1': { class_type: 'LoraLoaderModelOnly', inputs: { lora_name: 'MOSS/a.safetensors' } } };
  try { await preflightWorkflow(base, wf); assert.ok(true); } finally { s.close(); }
});

test('preflight：值不在白名单 → CONFIG 错误且给出相近候选', async () => {
  const { s, base } = await serve({
    '/object_info/LoraLoaderModelOnly': { LoraLoaderModelOnly: { input: { required: { lora_name: [['MOSS/a.safetensors']] } } } },
  });
  const wf = { '1': { class_type: 'LoraLoaderModelOnly', inputs: { lora_name: 'a.safetensors' } } };
  try {
    await assert.rejects(() => preflightWorkflow(base, wf), (e) => {
      assert.equal(e.code, 'CONFIG');
      assert.equal(e.nonRetryable, true);
      assert.match(e.message, /相近/);
      return true;
    });
  } finally { s.close(); }
});

test('preflight：节点类在实例上不存在 → class_missing', async () => {
  const { s, base } = await serve({ '/object_info/LoraLoaderModelOnly': {} });
  const wf = { '1': { class_type: 'LoraLoaderModelOnly', inputs: {} } };
  try {
    await assert.rejects(() => preflightWorkflow(base, wf), (e) => {
      assert.equal(e.code, 'CONFIG');
      assert.match(e.message, /缺少节点类/);
      return true;
    });
  } finally { s.close(); }
});
