import { GeoJSONFeature } from "maplibre-gl";
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

export function createCategoricalOutlookPoller(probPath: string, condPath: string) {
    const poller = new MultiFetchPoller(
        10*MINUTES,
        [
            "https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer/3/query?where=1%3D1&f=geojson&outSR=4326&outFields=*",
            "https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer/2/query?where=1%3D1&f=geojson&outSR=4326&outFields=*",
        ],
        (data) => {
            const prob = data[0];
            const cond = data[1];
            if (
                prob.features.length > 0 &&
                cond.features.length > 0 &&
                prob.features[0].properties.issue != cond.features[0].properties.issue
            ) throw new Error("Mismatch between probabilistic and intensity issue times");
            // should probably be throw due to future "date updated" code i might add to poller
            
            prob.features.forEach((f: GeoJSONFeature) => {
                if (!isNaN(f.properties.label)) {
                    f.properties.label = (parseFloat(f.properties.label) * 100) + "%";
                }
            });

            prob.features.push(...cond.features);
            OUTLOOK_SOURCE().setData(prob);
        }
    );

    return () => poller.stop();
}


export const OutlookPath = {
    SPC_DAY1_CONVECTIVE: "SPC_wx_outlks/MapServer/1"
};


//  https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer/1/query?where=1%3D1&f=geojson&outSR=4326&outFields=*