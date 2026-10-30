import { fetchOK } from "../util/network";

const NWS_API = "https://api.weather.gov/";
const MAX_FETCH_TRIES = 3;


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