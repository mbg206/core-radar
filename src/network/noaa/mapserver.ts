import { GeoJSONSource } from "maplibre-gl";
import { MapSourcePoller, MINUTES } from "../util";
import { OUTLOOK_SOURCE } from "../../map/map";

export function createOutlookPoller(path: string) {
    const poller = new MapSourcePoller(
        10*MINUTES,
        "https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/" + path + "/query?where=1%3D1&f=geojson&outSR=4326&outFields=*",
        (data) => {
            OUTLOOK_SOURCE().setData(data);
        }
    );

    return () => poller.stop();
}


export const OutlookPath = {
    SPC_DAY1_CONVECTIVE: "SPC_wx_outlks/MapServer/1"
};


//  https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer/1/query?where=1%3D1&f=geojson&outSR=4326&outFields=*