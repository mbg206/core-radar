import { GeoJSONSource } from "maplibre-gl";
import { MAP } from "../map/map";
import { fetchNWS } from "./nws";

interface RadarStation {
    lon: number;
    lat: number;
    identifier: string;
    offline: boolean;
}

export const RADAR_STATIONS: RadarStation[] = [];
let MAP_SOURCE: GeoJSONSource;


async function fetchRadars(): Promise<RadarStation[]> {
    // profiler radars appear in list by default
    // https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ncdc:C01627
    const data = await fetchNWS("radar/stations?stationType=WSR-88D,TDWR");
    RADAR_STATIONS.length = 0;
    const mapFeatures = [];

    const now = Date.now();
    for (const feature of data.features) {
        const {properties} = feature;
        const offline = (now - Date.parse(properties.latency.levelTwoLastReceivedTime)) > (20*60_000) // 20min

        RADAR_STATIONS.push({
            lon: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
            identifier: properties.id,
            offline
        });

        mapFeatures.push({
            type: "feature",
            geometry: feature.geometry,
            properties: {
                id: properties.id,
                isTDWR: properties.stationType != "WSR-88D",
                offline,
                diff: (now - Date.parse(properties.latency.levelTwoLastReceivedTime))
            }
        })
    }

    MAP_SOURCE.setData({
        type: "FeatureCollection",
        features: mapFeatures
    });
    console.log(mapFeatures);
    return RADAR_STATIONS;
}

MAP.on("load", () => {
    MAP_SOURCE = MAP.getSource<GeoJSONSource>("stations");
    fetchRadars();
    setInterval(fetchRadars, (10*60_000)) // 10min
});