const sw = self;
const pendingRequest = [];
function getScriptContent(client, fileName) {
  let id = 0;
  while (pendingRequest[id]) {
    id++;
  }
  pendingRequest[id] = () => {
  };
  client.postMessage({
    id,
    fileName,
    name: "sw_getScriptContent"
  });
  return new Promise((resolve) => pendingRequest[id] = resolve);
}
sw.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  event.respondWith(
    (async () => {
      const virtualModulePrefix = "/__virtual_module__/";
      const client = await sw.clients.get(event.clientId);
      if (client?.type === "window" && client?.frameType === "nested" && url.pathname.startsWith(virtualModulePrefix)) {
        const content = await getScriptContent(client, url.pathname.slice(virtualModulePrefix.length));
        if (content) {
          return new Response(content, {
            headers: {
              "Content-Type": "application/javascript"
            }
          });
        }
      }
      return fetch(event.request).catch();
    })()
  );
});
sw.onmessage = ({ data }) => {
  pendingRequest[data.id]?.(data.content);
  pendingRequest[data.id] = void 0;
};
sw.addEventListener("install", () => sw.skipWaiting());
sw.addEventListener("activate", (event) => event.waitUntil(sw.clients.claim()));
