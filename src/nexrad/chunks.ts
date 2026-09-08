// https://unidata-nexrad-level2-chunks.s3.amazonaws.com/?list-type=2&prefix=KDVN

const NEXRAD_BASE = "https://unidata-nexrad-level2-chunks.s3.amazonaws.com/?list-type=2";
function initRadar() {
    
}

export async function getLatestScans() {
    await fetch("https://unidata-nexrad-level3.s3.amazonaws.com/?list-type=2");
}