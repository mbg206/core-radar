const NWS_API = "https://api.weather.gov/";
const MAX_FETCH_TRIES = 3;

export async function fetchOK(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Got response code ${res.status} while fetching: ${url}`);
    return res;
}


export async function fetchNWS(path: string) {
    let tries = 0;
    while (true) {
        try {
            const res = await fetchOK(NWS_API + path);
            return await res.json();
        }
        catch (e) {
            tries++;
            if (tries == MAX_FETCH_TRIES) {
                throw e;
            }
        }
    }
}