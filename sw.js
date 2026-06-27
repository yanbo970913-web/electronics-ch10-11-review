const CACHE='opa-review-v5';
const CORE=['./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))));});
self.addEventListener('activate',e=>{e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.map(k=>k!==CACHE?caches.delete(k):null))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const isHTML=e.request.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('index.html');
  if(isHTML){   // network-first：HTML 永遠抓最新，避免快取舊版
    e.respondWith(fetch(e.request).then(resp=>{const cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp).catch(()=>{}));return resp;})
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  // 其餘靜態資源：cache-first（離線/速度）
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp).catch(()=>{}));return resp;})));
});