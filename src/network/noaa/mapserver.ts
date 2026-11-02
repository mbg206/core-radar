import { GeoJSONSource } from "maplibre-gl";
import { FetchPoller, MINUTES, MultiFetchPoller } from "../util";
import { OUTLOOK_SOURCE } from "../../map/map";

export function createOutlookPoller(path: string) {
    const poller = new FetchPoller(
        10*MINUTES,
        "https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/" + path + "/query?where=1%3D1&f=geojson&outSR=4326&outFields=*",
        (data) => {
            OUTLOOK_SOURCE().setData(data);
        }
    );

    return () => poller.stop();
}

export function createCategoricalOutlookPoller(catPath: string, intPath: string) {
    const poller = new MultiFetchPoller(
        10*MINUTES,
        [
        ],
        (data) => {
            // TODO
            OUTLOOK_SOURCE().setData(data);
        }
    );

    return () => poller.stop();
}


export const OutlookPath = {
    SPC_DAY1_CONVECTIVE: "SPC_wx_outlks/MapServer/1"
};


//  https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer/1/query?where=1%3D1&f=geojson&outSR=4326&outFields=*