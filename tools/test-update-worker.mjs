import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base='https://example.test/Family-Spots-Map-V4-Neu/';
const js=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
const version=js.match(/const CACHE_VERSION = \"([^\"]+)\"/)?.[1];

function environment({fail=null,bad=null}={}) {
 const listeners=new Map();
 const maps=new Map();
 const events=[];
 const caches={
  async open(name){if (!maps.has(name))maps.set(name,new Map());const map=maps.get(name);return {
   async put(key,response){map.set(String(key),response.clone())},
   async match(key){return map.get(String(key))?.clone()||undefined}
  }},
  async keys(){return [...maps.keys()]},
  async delete(name){return maps.delete(name)}
 };
 const fetch=async (item)=>{
  const raw=typeof item==='string'?item:item.url;
  const url=new URL(raw,base);
  if (!url.href.startsWith(base))throw Error('Unexpected URL '+url);
  let rel=url.pathname.slice(new URL(base).pathname.length);
  if (!rel)rel='index.html';
  if (rel===fail) return new Response('not found',{status:404});
  const content=rel===bad ? Buffer.from('Tampered JavaScript') : fs.readFileSync(path.join(root,rel));
  const type=rel.endsWith('.json')?'application/json':'application/octet-stream';
  return new Response(content,{status:200,headers:{'Content-Type':type}});
 };
 const ctx=vm.createContext({self:{location:{href:base},clients:{claim:async()=>{}},skipWaiting:async()=>{ctx.skipped=true},addEventListener:(type,cb)=>listeners.set(type,cb)},URL,Response,Uint8Array,DataView,Map,Set,Array,JSON,Promise,AbortController,setTimeout,clearTimeout,crypto:webcrypto,caches,fetch,console});
 vm.runInContext(js,ctx,{filename:'service-worker.js'});
 const assets=vm.runInContext('ASSETS',ctx);
 async function invoke(type,extras={}){
  const ev={waitUntil(p){events.push(p)},...extras};
  listeners.get(type)(ev);
  const p=events.splice(0)[0];
  if(p)await p;
 }
 return {invoke,caches,maps,assets,ctx,listeners};
}
const tests=[];
async function run(name,fn){try{await fn();console.log('PASS',name);tests.push(true)}catch(e){console.error('FAIL',name,e);tests.push(false)}}
await run('complete mandatory install and activation',async()=>{
 const t=environment();await t.invoke('install');assert.equal(t.ctx.skipped,true);assert.equal(t.maps.size,1);assert.equal([...t.maps.values()][0].size,t.assets.filter(x=>!x.startsWith('assets/spots/')).length);
 await t.invoke('activate');assert.equal(t.maps.size,1);
});
await run('optional spot photograph unavailable does not block update',async()=>{
 const t=environment({fail:'assets/spots/windheimstrasse/0769.webp'});await t.invoke('install');assert.equal(t.ctx.skipped,true);assert.equal([...t.maps.values()][0].size,t.assets.filter(x=>!x.startsWith('assets/spots/')).length);
});
await run('required app asset unavailable rejects without clearing old cache',async()=>{
 const t=environment({fail:'js/app.js'});t.maps.set('family-spots-map-older',new Map([['old',{yes:true}]]));await assert.rejects(t.invoke('install'));assert.equal(t.maps.size,1);assert.ok(t.maps.has('family-spots-map-older'));assert.equal(t.ctx.skipped,undefined);
});
await run('tampered JS fails hash validation and preserves old cache',async()=>{
 const t=environment({bad:'js/app.js'});t.maps.set('family-spots-map-older',new Map([['old',{yes:true}]]));await assert.rejects(t.invoke('install'),/File does not match/);assert.ok(t.maps.has('family-spots-map-older'));assert.equal(t.ctx.skipped,undefined);
});
await run('retains one preceding offline cache after successful activation',async()=>{
 const t=environment();t.maps.set('family-spots-map-older',new Map([['old',{yes:true}]]));await t.invoke('install');await t.invoke('activate');assert.equal(t.maps.size,2);assert.ok(t.maps.has('family-spots-map-older'));
});
await run('service worker exposes installed version',async()=>{
 const t=environment();const results=[];t.listeners.get('message')({data:{type:'GET_VERSION'},ports:[{postMessage:(v)=>results.push(v)}]});assert.equal(results[0].version,version);
});
console.log(`${tests.filter(Boolean).length}/${tests.length} tests passed`);if(tests.some(x=>!x))process.exitCode=1;
