import "./ui/ui";
import { getL2Scans, getL3Scans, getMRMSData } from './network/aws/nexrad';
import { parseL2Data } from './radar/comms';





parseL2Data();