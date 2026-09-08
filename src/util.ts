function zp(n: number): string {
    return n.toString().padStart(2, '0');
}

export function getUTCDateStr(seperator: string = '', yesterday: boolean = false): string {
    const date = new Date();
    if (yesterday) {
        date.setTime(date.getTime() - (24 * H_TO_MS));
    }
    return `${date.getUTCFullYear()}${seperator}${zp(date.getUTCMonth()+1)}${seperator}${zp(date.getUTCDate())}`;
}

export const H_TO_MS = 60 * 60 * 1000;
export const M_TO_MS = 60 * 1000;