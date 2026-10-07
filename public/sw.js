/// <reference lib="webworker" />
const sw = self;
const pendingRequest = [];
function getScriptContent(client, fileName) {
	let id = 0;
	while (pendingRequest[id]) {
		id++;
	}
	pendingRequest[id] = () => {};
	client.postMessage({
		id,
		fileName,
		name: "sw_getScriptContent"
	});
	return new Promise((resolve) => pendingRequest[id] = resolve);
}
sw.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);
	event.respondWith((async () => {
		const virtualModulePrefix = "/__virtual_module__/";
		const client = await sw.clients.get(event.clientId);
		if (client?.type === "window" && client?.frameType === "nested" && url.pathname.startsWith(virtualModulePrefix)) {
			const content = await getScriptContent(client, url.pathname.slice(virtualModulePrefix.length));
			if (content) {
				return new Response(content, { headers: { "Content-Type": "application/javascript" } });
			}
		}
		return fetch(event.request).catch();
	})());
});
sw.onmessage = (event) => {
	const data = event.data;
	// 唤醒探测：worker 被浏览器空闲停止后，后续页面请求可能不再经过它，
	// 收到消息（并回执）说明 worker 已启动，之后的请求才会被重新接管
	if (data?.name === "sw_ping") {
		event.source?.postMessage({
			name: "sw_pong",
			t: data.t
		});
		return;
	}
	pendingRequest[data.id]?.(data.content);
	pendingRequest[data.id] = undefined;
};
sw.addEventListener("install", () => sw.skipWaiting());
sw.addEventListener("activate", (event) => event.waitUntil(sw.clients.claim()));
