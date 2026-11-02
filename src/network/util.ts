import { Source } from "maplibre-gl";

export async function fetchOK(url: RequestInfo) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Got response code ${res.status} while fetching: ${url}`);
    return res;
}

abstract class Poller {
    controller = new AbortController();
    timeout: number
    start: () => Promise<void>

    constructor(interval: number, handler: (data: any) => void) {
        this.start = () => this.pollerFetch()
            .then((data) => {
                if (this.controller.signal.aborted) return;
                handler(data);
            })
            .catch(e => {
                if (this.controller.signal.aborted) return;
                console.error(e);
            })
            .finally(() => 
                this.timeout = setTimeout(this.start, interval)
            );
    }
    
    stop() {
        this.controller.abort();
        clearTimeout(this.timeout);
    }

    abstract pollerFetch(): Promise<any>
}

export class FetchPoller extends Poller {
    request: Request;
    isJSON: boolean;
    constructor(interval: number, url: string, handler: (data: any) => void, isJSON: boolean = true) {
        super(interval, handler);
        this.request = new Request(url, {signal: this.controller.signal});
        this.isJSON = isJSON;
        this.start();
    }
    
    async pollerFetch(): Promise<any> {
        const res = await fetchOK(this.request);
        return this.isJSON ? res.json() : res.text();
    }
}


export class MultiFetchPoller extends Poller {
    requests: {req: Request, isJSON: boolean}[];
    constructor(interval: number, urls: (string|{url: string, isJSON: boolean})[], handler: (data: any) => void) {
        super(interval, handler);
        this.requests = urls.map(
            data => typeof data == "string" ?
                ({req: new Request(data, {signal: this.controller.signal}), isJSON: true}) :
                ({req: new Request(data.url, {signal: this.controller.signal}), isJSON: data.isJSON})
        );
        this.start();
    }
    
    async pollerFetch(): Promise<any> {
        const fetches = this.requests.map(data => fetchOK(data.req));
        const ress = await Promise.all(fetches);
        return Promise.all(ress.map((res, i) => this.requests[i].isJSON ? res.json() : res.text()));
    }
}

export const MINUTES = 1 * 60 * 1000;