const CACHE='opa-review-v3';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.concat(['./bgm.mp3']).map(u=>c.add(u).catch(()=>{})))));});
self.addEventListener('activate',e=>{e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.map(k=>k!==CACHE?caches.delete(k):null))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    const cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp).catch(()=>{}));return resp;
  }).catch(()=>caches.match('./index.html'))));});