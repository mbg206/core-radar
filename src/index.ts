import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import {STYLE} from "./style";
import { getL2Scans, getL3Scans, getMRMSData } from './network/aws/nexrad';
import { parseL2Data } from './radar/comms';

maplibregl.setWorkerUrl(new URL('./worker.js', import.meta.url).toString());


if (!window.location.search.includes("test")) {
const map = new maplibregl.Map({
    container: 'map',
    style: STYLE,
    center: [-98.583, 39.833],
    zoom: 4,
    minZoom: 2,
    maxZoom: 16,
    // https://github.com/maplibre/maplibre-gl-js/blob/0d4b6f1e7d53beac00a4423ce53e7c16a3353b5f/src/tile/tile_manager.ts#L460
    maxTileCacheZoomLevels: 10, // default: 5
    localIdeographFontFamily: false // TODO prefer EN fonts in style tho 
});

map.on('load', () => {
    const source = map.getSource<maplibregl.RasterTileSource>('radar');
    //source.tileSize = 256;
    source.setTiles([
        "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q/{z}/{x}/{y}.png",
        //"https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows?service=wms&version=1.1.1&request=GetMap&bbox={bbox-epsg-3857}&srs=EPSG:3857&format=image/png&width=256&height=256&layers=conus_bref_qcd&transparent=true&tiles=true&time=2026-09-03T20:30:16.000Z"
    ]);
});
}

parseL2Data();