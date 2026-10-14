import { MAP } from './map/map';
import { getL2Scans, getL3Scans, getMRMSData } from './network/aws/nexrad';
import { parseL2Data } from './radar/comms';




if (!window.location.search.includes("test")) {
MAP
}

parseL2Data();