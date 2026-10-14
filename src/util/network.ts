export async function fetchOK(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Got response code ${res.status} while fetching: ${url}`);
    return res;
}