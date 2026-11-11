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
            .finally(() => {
                if (this.controller.signal.aborted) return;
                this.timeout = setTimeout(this.start, interval)
            });
    }
    
    stop() {
        this.controller.abort();
        clearTimeout(this.timeout);
    }

    abstract pollerFetch(): Promise<any>
}


type FetchRequestObj = {req: Request, isJSON: boolean};
type FetchRequestData = string | FetchRequestObj;

function toReqObj(data: FetchRequestData, signal: AbortSignal): FetchRequestObj {
    if (typeof data == "string") {
        return {req: new Request(data, {signal}), isJSON: true};
    }
    return data;
}

export class FetchPoller extends Poller {
    private requests: FetchRequestObj[];
    private isArray: boolean;
    constructor(interval: number, url: FetchRequestData | FetchRequestData[], handler: (data: any) => void) {
        super(interval, handler);
        
        if (Array.isArray(url)) {
            this.requests = url.map((u) => toReqObj(u, this.controller.signal));
            this.isArray = true;
        }
        else {
            this.requests = [toReqObj(url, this.controller.signal)];
            this.isArray = false;
        }
        this.start();
    }
    
    async pollerFetch(): Promise<any> {
        const fetches = this.requests.map(data => fetchOK(data.req));
        const ress = await Promise.all(fetches);
        const res = await Promise.all(ress.map((res, i) => this.requests[i].isJSON ? res.json() : res.text()));
        if (!this.isArray) return res[0];
        return res;
    }
}

export const MINUTES = 1 * 60 * 1000;