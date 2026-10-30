import { Source } from "maplibre-gl";

export async function fetchOK(url: RequestInfo) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Got response code ${res.status} while fetching: ${url}`);
    return res;
}

export class MapSourcePoller {
    controller = new AbortController();
    timeout: number

    constructor(interval: number, url: string, handler: (data: any) => void, isJSON: boolean = true) {
        const request = new Request(url, {signal: this.controller.signal});

        const fetcher = () => fetchOK(request).then(res => isJSON ? res.json() : res.text())
            .then((data) => {
                if (this.controller.signal.aborted) return;
                handler(data);
                this.timeout = setTimeout(fetcher, interval);
            })
            .catch(e => {
                if (this.controller.signal.aborted) return;
                console.error(e);
            });
        fetcher();
    }
    
    stop() {
        this.controller.abort();
        clearTimeout(this.timeout);
    }
}

export const MINUTES = 1 * 60 * 1000;