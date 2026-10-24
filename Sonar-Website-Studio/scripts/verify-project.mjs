import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFile(path.join(root, file), 'utf8');
const mustExist = async (file) => access(path.join(root, file));
const pkg = JSON.parse(await read('package.json'));
const app = await read('artifacts/sonar-site/src/App.tsx');
const vite = await read('artifacts/sonar-site/vite.config.ts');
const api = await read('local-server.mjs');
const envExample = await read('.env.example');

assert.equal(pkg.scripts.dev, 'node --env-file-if-exists=.env dev.mjs');
assert.equal(pkg.scripts.build, 'vite build --config artifacts/sonar-site/vite.config.ts');
assert.equal(pkg.scripts.start, 'node --env-file-if-exists=.env local-server.mjs');
for (const route of ['/', '/sons', '/audicao', '/laboratorio', '/quiz', '/ia']) {
  assert.ok(app.includes(`path="${route}"`), `missing route ${route}`);
assert.ok(!app.includes('/observacoes') && !app.includes('function Observacoes'), 'observations page should be removed');
assert.ok(app.includes('const quizQuestions = [') && (app.match(/explanation:/g) || []).length >= 10, 'quiz should contain ten questions');
assert.ok(app.includes('SONAR IA') && app.includes('chat-suggestions'), 'modern AI chat should be present');
}
for (const feature of ['Web Audio API', 'OPENROUTER_API_KEY', 'prefers-reduced-motion', 'quiz-progress']) {
  if (feature === 'Web Audio API') assert.ok(app.includes('AudioContextClass'), 'missing browser audio API implementation');
  else if (feature === 'OPENROUTER_API_KEY') assert.ok(api.includes('OPENROUTER_API_KEY'), 'missing server-only API key lookup');
  else if (feature === 'prefers-reduced-motion') assert.ok(app.includes(feature) && (await read('artifacts/sonar-site/src/index.css')).includes(feature), 'missing reduced-motion support');
  else assert.ok(app.includes(feature), 'missing quiz progress indicator');
}
assert.ok(vite.includes("process.env.PORT?.trim() || '5173'"), 'Vite must have a default port');
assert.ok(vite.includes("process.env.BASE_PATH?.trim() || '/'"), 'Vite must have a default base path');
assert.ok(envExample.includes('OPENROUTER_API_KEY=') && !envExample.match(/OPENROUTER_API_KEY=\S+/), 'example file must not contain a real API key');
assert.ok(api.includes('process.env.OPENROUTER_MODEL'), 'model should be configurable');
for (const file of ['README.md', '.env.example', 'dev.mjs', 'local-server.mjs', 'api/sonar/insight.js', 'vercel.json', 'artifacts/sonar-site/index.html', 'artifacts/sonar-site/src/assets/sonar-dog-editorial.jpg']) await mustExist(file);
assert.ok((await read('vercel.json')).includes('dist'), 'Vercel output directory must be dist');
assert.ok((await read('api/sonar/insight.js')).includes('OPENROUTER_API_KEY'), 'Vercel function must read the API key server-side');
console.log('SONAR static verification: PASS');
console.log('Checked: npm scripts, route map, Vite defaults, audio implementation, reduced-motion support, quiz progress, server-only OpenRouter configuration and required files.');
