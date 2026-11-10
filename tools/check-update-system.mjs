// Release safety gate: verify the long-term update mechanism itself.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const sw=read('service-worker.js');
const worker=read('js/sw-register.js');
const as=sw.match(/const ASSETS = (\[[\s\S]*?\n\]);/);
assert(as,'Offline asset manifest missing');
const assets=JSON.parse(as[1]);
assert.equal(assets.length,new Set(assets).size,'Duplicate offline URL');
const core=assets.filter(x=>!x.startsWith('assets/spots/'));
const optional=assets.filter(x=>x.startsWith('assets/spots/'));
assert(core.length>=25,'Core offline assets unexpectedly missing');
assert(optional.length>0,'Optional spot photographs accidentally made mandatory');
assert(sw.includes('CORE_ASSETS.slice(i, i + 8)'),'Installing all images must not block upgrades');
assert(sw.includes('await self.skipWaiting();'),'Finished updates must activate automatically');
assert(sw.includes('GET_VERSION'),'Installed release version must be queryable');
assert(worker.includes('release-info.json'),'Published version diagnostics missing');
assert(sw.includes('async function validateMapPresentation('),'Integrity validation absent');
assert(worker.includes('addEventListener("controllerchange"'),'Safe document refresh missing');
assert(worker.includes('if (hasDraft())'),'User drafts must remain protected');
assert(worker.includes('registration.update()'),'Browser must check for new updates');
const names=['index.html','en/index.html','da/index.html'];
const version=sw.match(/const CACHE_VERSION = "([^"]+)"/)?.[1];
assert(version,'Version marker missing');
for(const name of names){
  const page=read(name);
  assert(page.includes(`js/app.js?v=${version}`),`${name}: unsynchronised app release`);
  assert(page.includes(`css/styles.css?v=${version}`),`${name}: unsynchronised CSS release`);
  assert(page.includes(`js/sw-register.js?v=${version}`),`${name}: registration script must have unique release URL`);
}
for(const filename of assets){
  const file=filename==='./'?'index.html':filename;
  assert(fs.existsSync(path.join(root,file)),`Absent offline dependency: ${filename}`);
}
console.log(`Update-system gate passed: ${core.length} core assets, ${optional.length} non-blocking spot photos, ${names.length} languages, safe refresh.`);
