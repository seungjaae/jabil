/*
 * 서비스워커: 파일을 캐시에 저장해두어 인터넷이 느리거나 끊겨도 화면이 뜨게 합니다.
 * 내용을 수정한 뒤 반영이 안 되면 아래 CACHE_NAME 의 숫자를 올리세요.
 */

const CACHE_NAME = "golmok-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/render.js",
  "./data/site-data.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// 네트워크를 먼저 시도하고, 실패하면 캐시에서 꺼내 보여줍니다.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((hit) => hit || caches.match("./index.html")))
  );
});
