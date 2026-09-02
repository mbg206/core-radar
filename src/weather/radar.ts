import { fetchNWS } from "../api/nws";

interface RadarStation {
    lon: number;
    lat: number;
    identifier: string;
    available: boolean;
}

export async function fetchRadars(): Promise<RadarStation[]> {
    // profiler radars appear in list by default
    // https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ncdc:C01627
    const data = await fetchNWS("radar/stations?stationType=WSR-88D,TDWR");
    const stations: RadarStation[] = [];
    const now = Date.now();
    for (const feature of data.features) {
        stations.push({
            lon: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
            identifier: feature.properties.id,
            available: (now - Date.parse(feature.properties.latency.maxLatencyTime)) <= 10_000_000
        });
    }
    return stations;
}