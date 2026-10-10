
self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (!url.pathname.endsWith("/Build/WebGL-Release.data")) {
    return;
  }

  event.respondWith((async () => {
    const chunks = [];

    for (let index = 0; index < 4; index++) {
      const name = `Build/WebGL-Release.data.part${String(index).padStart(3, "0")}`;
      const response = await fetch(
        new URL(name, self.registration.scope)
      );

      if (!response.ok) {
        throw new Error(`Failed to load ${name}: ${response.status}`);
      }

      chunks.push(await response.arrayBuffer());
    }

    return new Response(new Blob(chunks), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream"
      }
    });
  })());
});