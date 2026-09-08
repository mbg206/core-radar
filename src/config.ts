import { M_TO_MS } from "./util";

export const CRConfig = {
    RADAR_TIMELINE_LIMIT: 60 // 60min
};

export function RadarNewerThan() {
    return Date.now() - (CRConfig.RADAR_TIMELINE_LIMIT * M_TO_MS);
}