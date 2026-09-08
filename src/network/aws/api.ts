import { fetchOK } from "../../nws/nws";

export interface AWSObject {
    key: string;
    modified?: string;
    date?: number;
    size: number;
}

function parseXML(data: string) {
    return new DOMParser().parseFromString(data, "application/xml");
}

export async function getLastBucketObjects(host: string, prefix: string, limit: number): Promise<AWSObject[]> {
    let token: string | undefined;
    let prevData: Document | null = null;
    const url = `${host}/?list-type=2&prefix=${prefix}`;

    let tags: Element[] = [];

    while (true) {
        const res = await fetchOK(
            token == undefined ? url : `${url}&continuation-token=${encodeURIComponent(token)}`
        );
        const data = parseXML(await res.text());
        token = data.getElementsByTagName("NextContinuationToken")[0]?.textContent;
        
        // no next token; we can return now
        if (token === undefined) {
            const currentTags = data.getElementsByTagName("Contents");
            const cn = currentTags.length;

            // latest fetch contains needed data
            if (cn >= limit || prevData == null) {
                for (let i = Math.max(cn - limit, 0); i < cn; i++) {
                    tags.push(currentTags[i]);
                }
            }

            // latest fetch doesn't have enough data, need
            // to merge with last fetch
            else {
                const prevTags = prevData.getElementsByTagName("Contents");
                const pn = prevTags.length;

                for (let i = pn - limit + cn; i < pn; i++) {
                    tags.push(prevTags[i]);
                }
                for (let i = 0; i < cn; i++) {
                    tags.push(currentTags[i]);
                }
            }

            break;
        }

        prevData = data;
    }

    return tags.map(tag => ({
        key: tag.querySelector("Key").textContent,
        modified: tag.querySelector("LastModified").textContent,
        size: parseInt(tag.querySelector("Size").textContent)
    }));
}

export async function getLastTimedObjects(host: string, prefix: string, newerThan: number, dateParser: (date: string) => number): Promise<{tags: AWSObject[], foundOlder: boolean}> {
    let token: string | undefined;
    const url = `${host}/?list-type=2&prefix=${prefix}`;
    console.log(`newer than: ${new Date(newerThan).toLocaleString()}`)

    let tags: Element[] = [];
    let foundNew = false;
    let foundOlder = false;

    while (true) {
        const res = await fetchOK(
            token == undefined ? url : `${url}&continuation-token=${encodeURIComponent(token)}`
        );
        const data = parseXML(await res.text());
        token = data.getElementsByTagName("NextContinuationToken")[0]?.textContent;
        const currentTags = data.getElementsByTagName("Contents");

        for (const tag of currentTags) {
            const key = tag.querySelector("Key").textContent;

            // for level II model data files
            if (key.endsWith("_MDM")) continue;

            if (!foundNew) {
                if (dateParser(key) >= newerThan) {
                    foundNew = true;
                }
                else {
                    foundOlder = true;
                }
            }

            if (foundNew) {
                tags.push(tag);
            }
        }

        // no next token; we can return now
        if (token === undefined) {
            break;
        }
    }

    return {
        tags: tags.map(tag => {
            const key = tag.querySelector("Key").textContent;
            return {
                key,
                date: dateParser(key),
                size: parseInt(tag.querySelector("Size").textContent)
            };
        }),
        foundOlder
    };
}