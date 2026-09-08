import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import {STYLE} from "./style";
import { getL2Scans, getL3Scans, getMRMSData } from './network/aws/nexrad';

maplibregl.setWorkerUrl(new URL('./worker.js', import.meta.url).toString());

/*
const map = new maplibregl.Map({
    container: 'map',
    //style: STYLE,
    style: "https://tiles.openfreemap.org/styles/bright", // style URL
    center: [-98.583, 39.833], // starting position [lng, lat]
    zoom: 4,
    minZoom: 2,
    maxZoom: 16,
    // https://github.com/maplibre/maplibre-gl-js/blob/0d4b6f1e7d53beac00a4423ce53e7c16a3353b5f/src/tile/tile_manager.ts#L460
    maxTileCacheZoomLevels: 10 // default: 5
});

map.on('load', () => {
    map.addSource('radar', {
        type: 'raster',
        tiles: [
            //"https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q/{z}/{x}/{y}.png",
            "https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows?service=wms&version=1.1.1&request=GetMap&bbox={bbox-epsg-3857}&srs=EPSG:3857&format=image/png&width=256&height=256&layers=conus_bref_qcd&transparent=true&tiles=true&time=2026-09-03T20:30:16.000Z"
        ],
        tileSize: 256,
        volatile: true
    });
    map.addLayer({
        id: 'radar-layer',
        type: 'raster',
        source: 'radar',
        paint: {
            'resampling': 'nearest',
            'raster-fade-duration': 0,
            'raster-opacity': 0.8
        },
    });
});

map.on('zoom', (e) => {
    const zoom = e.target.getZoom();
    let opacity = zoom * (-1/14) + (48/35);
    opacity = Math.min(0.8, Math.max(0.4, opacity));
    map.setPaintProperty('radar-layer', 'raster-opacity', opacity);
});
*/

getL3Scans().then(d => console.log(d));
getL2Scans().then(d => console.log(d));
getMRMSData().then(d => console.log(d));