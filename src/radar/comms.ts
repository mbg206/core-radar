const worker = new Worker(new URL("./data-worker.js", import.meta.url), {type: "module"});

worker.addEventListener("message", e=>console.log(e.data));
export async function parseL2Data() {
    worker.postMessage("glub");
}