const CACHE="ritosoccer-v17-r4";
const ASSETS=["./","./index.html","./manifest.webmanifest"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>/^ritosoccer-v\d+(?:-r\d+)?$/.test(k)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request).then(response=>{
    if(response.ok&&new URL(e.request.url).origin===self.location.origin){
      const copy=response.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)));
    }
    return response;
  }).catch(()=>caches.match(e.request)));
});
