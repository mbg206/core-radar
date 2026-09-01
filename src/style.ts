import {StyleSpecification} from "maplibre-gl";

// https://maplibre.org/maplibre-gl-js/docs/API/#sources
// https://openfreemap.org/quick_start/
// https://wiki.openstreetmap.org/wiki/Key:highway

// when importing:
// remove "metadata": {}, "id": string
export const STYLE: StyleSpecification = {
  "version": 8,
  "name": "",
  "metadata": {
    "maputnik:renderer": "mlgljs"
  },
  "sources": {
    "openmaptiles": {
      "type": "vector",
      "url": "https://tiles.openfreemap.org/planet"
    }
  },
  "sprite": "",
  "glyphs": "https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "#444"
      },
    },
    {
      "id": "water",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "water",
      "paint": {
        "fill-antialias": true,
        "fill-color": "#226",
        "fill-translate-anchor": "map"
      }
    },
    {
      "id": "water_name",
      "type": "symbol",
      "source": "openmaptiles",
      "source-layer": "water_name",
      "layout": {
        "symbol-placement": "line-center",
        "text-field": [
          "case",
          ["has", "name:nonlatin"],
          [
            "concat",
            ["get", "name:latin"],
            "\n",
            ["get", "name:nonlatin"]
          ],
          [
            "coalesce",
            ["get", "name_en"],
            ["get", "name"]
          ]
        ],
        "symbol-avoid-edges": false,
        "symbol-z-order": "auto",
        "text-pitch-alignment": "auto",
        "text-rotation-alignment": "map"
      },
      "paint": {
        "text-color": "#AAA",
        "text-translate-anchor": "map"
      },
      "filter": ["all"]
    }
  ],
  "projection": {"type": "mercator"}
};