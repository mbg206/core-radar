import { CRConfig, RadarNewerThan } from "../../config";
import { getUTCDateStr, M_TO_MS } from "../../util";
import { AWSObject, getLastBucketObjects, getLastTimedObjects } from "./api";

const NEXRAD_L2_HOST = "https://unidata-nexrad-level2.s3.amazonaws.com";
const NEXRAD_L2_CHUNKS_HOST = "https://unidata-nexrad-level2-chunks.s3.amazonaws.com";
const NEXRAD_L3_HOST = "https://unidata-nexrad-level3.s3.amazonaws.com";
const MRMS_HOST = "https://noaa-mrms-pds.s3.amazonaws.com";

function parseL2KeyDate(key: string): number {
    const year = key.slice(20, 24);
    const month = key.slice(24, 26);
    const day = key.slice(26, 28);
    const hour = key.slice(29, 31);
    const minute = key.slice(31, 33);
    const second = key.slice(33, 35);
    return Date.parse(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
}

function parseL3KeyDate(key: string): number {
    const year = key.slice(8, 12);
    const month = key.slice(13, 15);
    const day = key.slice(16, 18);
    const hour = key.slice(19, 21);
    const minute = key.slice(22, 24);
    const second = key.slice(25, 27);
    return Date.parse(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
}

function parseMRMSKeyDate(key: string): number {
    const year = key.slice(-24, -20);
    const month = key.slice(-20, -18);
    const day = key.slice(-18, -16);
    const hour = key.slice(-15, -13);
    const minute = key.slice(-13, -11);
    const second = key.slice(-11, -9);
    return Date.parse(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
}


// KBBX20241010_184118_V06
export async function getL2Scans(station: string = "KDMX"): Promise<AWSObject[]> {
    const newerThan = Date.now() - (CRConfig.RADAR_TIMELINE_LIMIT * M_TO_MS);
    const objData = await getLastTimedObjects(NEXRAD_L2_HOST, `${getUTCDateStr('/')}/${station}/${station}${getUTCDateStr()}_`, newerThan, parseL2KeyDate);
    if (objData.foundOlder) {
        return objData.tags;
    }
    const oldObjData = await getLastTimedObjects(NEXRAD_L2_HOST, `${getUTCDateStr('/', true)}/${station}/${station}${getUTCDateStr('', true)}_`, newerThan, parseL2KeyDate);

    const objs = oldObjData.tags;
    objs.push(...objData.tags);
    return objs
}

/*
FOR level II chunks:

get latest AWS page
spam requests until a new continuation key appears, marking what chunks are new
use new continuation key
repeat
*/

export async function getL3Scans(station: string = "DMX", type: string = "N0B"): Promise<AWSObject[]> {
    const newerThan = RadarNewerThan();
    const objData = await getLastTimedObjects(NEXRAD_L3_HOST, `${station}_${type}_${getUTCDateStr('_')}_`, newerThan, parseL3KeyDate);
    if (objData.foundOlder) {
        return objData.tags;
    }
    const oldObjData = await getLastTimedObjects(NEXRAD_L3_HOST, `${station}_${type}_${getUTCDateStr('_', true)}_`, newerThan, parseL3KeyDate);

    const objs = oldObjData.tags;
    objs.push(...objData.tags);
    return objs;
}

export async function getMRMSData(region: string = "CONUS", type: string = "MergedBaseReflectivityQC_00.50"): Promise<AWSObject[]> {
    const newerThan = RadarNewerThan();
    const objData = await getLastTimedObjects(MRMS_HOST, `${region}/${type}/${getUTCDateStr()}/`, newerThan, parseMRMSKeyDate);
    if (objData.foundOlder) {
        return objData.tags;
    }
    const oldObjData = await getLastTimedObjects(MRMS_HOST, `${region}/${type}/${getUTCDateStr('', true)}/`, newerThan, parseMRMSKeyDate);

    const objs = oldObjData.tags;
    objs.push(...objData.tags);
    return objs;
}
