import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {STYLE} from "./style";

const map = new maplibregl.Map({
    container: 'map',
    //style: STYLE,
    style: "https://tiles.openfreemap.org/styles/bright", // style URL
    center: [-98.583, 39.833], // starting position [lng, lat]
    zoom: 4,
    minZoom: 2,
    maxZoom: 16
});

// from (TL) -126.0, 50.0
// (N0R) to (BR) -66.0, 24.0
// (N0Q) to -126.0+(0.01*12200), 50.0-(0.01*5400)
map.on('load', () => {
    map.addSource('radar', {
        type: 'raster',
        tiles: ["https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q/{z}/{x}/{y}.png"],
        tileSize: 256,
        volatile: true
    });
    map.addLayer({
        id: 'radar-layer',
        type: 'raster',
        source: 'radar',
        paint: {
            'raster-fade-duration': 0,
            'raster-opacity': 0.8
        },
    });
});