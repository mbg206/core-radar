import type {PropertyValueSpecification, StyleSpecification} from "maplibre-gl";

function zoomInterp(from: number[], to: number[]): PropertyValueSpecification<number> {
  return ["interpolate", ["linear"], ["zoom"], from[0], from[1], to[0], to[1]];
}

export const STYLE: StyleSpecification = {
  version: 8,
  name: "Core Radar Style",
  metadata: {"maputnik:renderer": "mlgljs"},
  projection: {type: "mercator"},
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openstreetmap.us/vector/openmaptiles.json"
    },
    radar: {
      type: "raster",
      tiles: ["https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q/{z}/{x}/{y}.png"]
    },
    stations: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    }
  },
  sprite: new URL("./compiled/sprites", document.baseURI).href,
  glyphs: `${new URL("./assets/glyphs", document.baseURI).href}/{fontstack}/{range}.pbf`,
  layers: [
    {
      id: "background",
      type: "background",
      paint: {"background-color": "#444"}
    },
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      paint: {"fill-color": "#224", "fill-antialias": false}
    },
    {
      id: "water_way_intermittent",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      minzoom: 12,
      filter: [
        "all",
        ["==", ["get", "intermittent"], 1]
      ],
      paint: {
        "line-color": "#224",
        "line-width": zoomInterp([12, 1], [16, 4]),
        "line-dasharray": [2, 3]
      }
    },
    {
      id: "water_way",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      minzoom: 12,
      filter: [
        "all",
        ["==", ["get", "intermittent"], 0],
        ["!=", ["get", "class"], "river"]
      ],
      paint: {
        "line-color": "#224",
        "line-width": zoomInterp([12, 1], [16, 4]),
      }
    },
    {
      id: "road_taxiway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "aeroway",
      minzoom: 10.5,
      filter: [
        "all",
        ["!=", ["get", "class"], "runway"]
      ],
      paint: {
        "line-width": zoomInterp([13, 2], [20, 10]),
        "line-color": "rgba(172, 172, 172, 1)",
        "line-translate-anchor": "map"
      }
    },
    {
      id: "road_runway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "aeroway",
      minzoom: 10.5,
      filter: [
        "all",
        ["==", ["get", "class"], "runway"]
      ],
      paint: {
        "line-width": zoomInterp([13, 4], [20, 40]),
        "line-color": "rgba(172, 172, 172, 1)",
        "line-translate-anchor": "map"
      }
    },
    {
      id: "road_rail_hatch",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 10.5,
      filter: [
        "all",
        ["==", ["get", "class"], "rail"],
        ["!", ["has", "service"]]
      ],
      layout: {"line-join": "miter", "line-cap": "butt"},
      paint: {
        "line-width": zoomInterp([13, 2], [20, 8]),
        "line-color": "rgba(28, 28, 28, 1)",
        "line-dasharray": [0.2, 8]
      }
    },
    {
      id: "road_rail",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 11,
      filter: [
        "all",
        ["==", ["get", "class"], "rail"],
        ["!", ["has", "service"]]
      ],
      layout: {"line-join": "miter", "line-cap": "butt"},
      paint: {
        "line-width": zoomInterp([13, 1], [20, 2]),
        "line-color": "rgba(28, 28, 28, 1)"
      }
    },
    {
      id: "road_street",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 10.5,
      filter: [
        "all",
        [
          "in",
          ["get", "class"],
          ["literal", ["minor", "service"]]
        ],
        ["!", ["has", "parking"]]
      ],
      paint: {
        "line-width": zoomInterp([13, 1], [20, 4]),
        "line-color": "rgba(137, 137, 137, 1)"
      }
    },
    {
      id: "road_major",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 10.5,
      filter: [
        "all",
        [
          "in",
          ["get", "class"],
          ["literal", ["secondary", "tertiary", "unclassified"]]
        ]
      ],
      layout: {"visibility": "visible"},
      paint: {
        "line-width": zoomInterp([13, 2], [20, 20]),
        "line-color": "rgba(135, 106, 81, 1)"
      }
    },
    {
      id: "road_highway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 8,
      filter: [
        "all",
        ["==", ["get", "class"], "primary"]
      ],
      paint: {
        "line-width": zoomInterp([13, 2], [20, 20]),
        "line-color": "rgba(135, 106, 81, 1)"
      }
    },
    {
      id: "road_div_highway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: [
        "all",
        [
          "in",
          ["get", "class"],
          ["literal", ["motorway", "trunk"]]
        ]
      ],
      paint: {
        "line-width": zoomInterp([13, 2], [20, 20]),
        "line-color": "rgba(142, 90, 34, 1)"
      }
    },
    {
      id: "boundary_country",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: [
        "all",
        ["!=", ["get", "disputed"], 1],
        ["!=", ["get", "maritime"], 1],
        ["!", ["has", "claimed_by"]],
        ["==", ["get", "admin_level"], 2]
      ]
    },
    {
      id: "boundary_state",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      minzoom: 3,
      filter: [
        "all",
        ["!=", ["get", "disputed"], 1],
        ["!=", ["get", "maritime"], 1],
        ["!", ["has", "claimed_by"]],
        ["==", ["get", "admin_level"], 4]
      ],
      layout: {
        "visibility": "visible",
        "line-cap": "butt",
        "line-join": "miter"
      },
      paint: {"line-translate-anchor": "map"}
    },
    {
      id: "boundary_county",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      minzoom: 6,
      filter: [
        "all",
        ["!=", ["get", "disputed"], 1],
        ["!=", ["get", "maritime"], 1],
        ["!", ["has", "claimed_by"]],
        ["==", ["get", "admin_level"], 6]
      ],
      layout: {
        "visibility": "visible",
        "line-cap": "butt",
        "line-join": "miter"
      },
      paint: {"line-translate-anchor": "map"}
    },
    {
      id: "water_way_name",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "waterway",
      minzoom: 11.5,
      filter: [
        "any",
        ["==", ["get", "class"], "river"]
      ],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": ["Rounded Mplus 1c Regular"],
        "text-rotation-alignment": "map",
        "text-pitch-alignment": "auto",
        "symbol-placement": "line",
        "symbol-z-order": "auto",
        "symbol-avoid-edges": false
      },
      paint: {"text-color": "#AAA", "text-translate-anchor": "map"}
    },
    {
      id: "water_name",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "water_name",
      layout: {
        "text-font": ["Rounded Mplus 1c Regular"],
        "symbol-placement": "line",
        "text-field": ["get", "name_en"],
        "symbol-avoid-edges": false,
        "symbol-z-order": "auto",
        "text-pitch-alignment": "auto",
        "text-rotation-alignment": "map",
        "visibility": "visible"
      },
      paint: {"text-color": "#AAA", "text-translate-anchor": "map"}
    },
    {
      id: "water_name_point",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "water_name",
      minzoom: 2,
      maxzoom: 6,
      layout: {
        "text-font": ["Rounded Mplus 1c Regular"],
        "symbol-placement": "point",
        "text-field": ["get", "name_en"],
        "symbol-avoid-edges": false,
        "symbol-z-order": "auto",
        "text-pitch-alignment": "auto",
        "text-rotation-alignment": "map",
        "visibility": "visible",
        "text-max-width": 6
      },
      paint: {"text-color": "#AAA", "text-translate-anchor": "map"}
    },
    {
      id: "landuse_hospital",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      minzoom: 11.5,
      filter: [
        "all",
        ["==", ["get", "class"], "hospital"]
      ],
      paint: {"fill-color": "rgba(218, 147, 147, 0.35)"}
    },
    {
      id: "landuse_school",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      minzoom: 11.5,
      filter: [
        "all",
        [
          "in",
          ["get", "class"],
          ["literal", ["school", "college", "university"]]
        ]
      ],
      paint: {"fill-color": "rgba(147, 190, 218, 0.35)"}
    },
    {
      id: "poi_school",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "poi",
      minzoom: 13,
      filter: [
        "all",
        [
          "in",
          ["get", "class"],
          ["literal", ["school", "college"]]
        ]
      ],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": ["Rounded Mplus 1c Regular"],
        "symbol-placement": "point",
        "symbol-avoid-edges": false,
        "text-rotation-alignment": "auto",
        "visibility": "visible",
        "text-size": 16,
        "text-max-width": 6.2,
        "symbol-height-anchor": "ground",
        "text-keep-upright": true,
        "text-anchor": "top",
        "text-offset": [0, 0.8],
        "icon-image": "College",
        "icon-size": 1.5
      },
      paint: {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-color": "rgba(0, 0, 0, 1)",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    },
    {
      id: "poi_airport",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "aerodrome_label",
      minzoom: 11,
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": ["Rounded Mplus 1c Regular"],
        "symbol-placement": "point",
        "symbol-avoid-edges": false,
        "text-rotation-alignment": "auto",
        "visibility": "visible",
        "text-size": 16,
        "text-max-width": 6.2,
        "symbol-height-anchor": "ground",
        "text-keep-upright": true,
        "icon-image": "Plane",
        "text-anchor": "top",
        "text-offset": [0, 0.8]
      },
      paint: {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-color": "rgba(0, 0, 0, 1)",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    },
    {
      id: "poi_hospital",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "poi",
      minzoom: 12,
      filter: [
        "all",
        ["==", ["get", "subclass"], "hospital"]
      ],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": ["Rounded Mplus 1c Regular"],
        "symbol-placement": "point",
        "symbol-avoid-edges": false,
        "text-rotation-alignment": "auto",
        "visibility": "visible",
        "text-size": 16,
        "text-max-width": 6.2,
        "symbol-height-anchor": "ground",
        "text-keep-upright": true,
        "icon-image": "Hospital",
        "text-anchor": "top",
        "text-offset": [0, 0.8]
      },
      paint: {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-color": "rgba(0, 0, 0, 1)",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    },
    {
      id: "shield_highway_business",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "transportation_name",
      minzoom: 9,
      filter: [
        "all",
        [
          "in",
          ["get", "route_2_network"],
          ["literal", ["US:I:Business:Loop", "US:I:Business:Spur", "US:US:Business"]]
        ],
        ["has", "route_2_ref"]
      ],
      layout: {
        "symbol-placement": "line",
        "text-font": ["Rounded Mplus 1c Regular"],
        "text-field": ["get", "route_2_ref"],
        "icon-image": [
          "concat",
          ["get", "route_2_network"],
          "_",
          ["length", ["get", "route_2_ref"]]
        ],
        "icon-text-fit": "none",
        "icon-text-fit-padding": [2, 4, 2, 2],
        "text-anchor": "bottom",
        "text-justify": "center",
        "text-keep-upright": false,
        "text-pitch-alignment": "viewport",
        "symbol-z-order": "auto",
        "symbol-height-anchor": "ground",
        "icon-rotation-alignment": "viewport",
        "text-rotation-alignment": "viewport",
        "text-size": 10,
        "symbol-spacing": 350,
        "symbol-avoid-edges": false,
        "text-offset": [0, 0.8],
        "visibility": "visible"
      },
      paint: {
        "text-color": [
          "case",
          [
            "in",
            ["get", "route_2_network"],
            ["literal", ["US:I:Business:Loop", "US:I:Business:Spur"]]
          ],
          "#FFF",
          "#000"
        ]
      }
    },
    {
      id: "shield_state",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "transportation_name",
      minzoom: 9,
      filter: [
        "all",
        ["==", ["get", "network"], "us-state"],
        ["<=", ["get", "ref_length"], 5]
      ],
      layout: {
        "symbol-placement": "line",
        "text-font": ["Rounded Mplus 1c Regular"],
        "text-field": ["get", "ref"],
        "icon-image": ["concat", "US:State_", ["get", "ref_length"]],
        "icon-text-fit": "none",
        "icon-text-fit-padding": [2, 4, 2, 2],
        "text-anchor": "center",
        "text-justify": "center",
        "text-keep-upright": false,
        "text-pitch-alignment": "viewport",
        "symbol-z-order": "auto",
        "symbol-height-anchor": "ground",
        "icon-rotation-alignment": "viewport",
        "text-rotation-alignment": "viewport",
        "text-size": 10,
        "symbol-spacing": 300
      },
      paint: {
        "text-color": [
          "case",
          ["==", ["get", "network"], "us-interstate"],
          "#FFF",
          "#000"
        ]
      }
    },
    {
      id: "shield_highway_alt",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "transportation_name",
      minzoom: 9,
      filter: [
        "all",
        [
          "in",
          ["get", "route_2_network"],
          ["literal", ["US:US", "US:I"]]
        ],
        ["<=", ["length", ["get", "route_2_ref"]], 3],
        ["has", "route_2_ref"]
      ],
      layout: {
        "symbol-placement": "line",
        "text-font": ["Rounded Mplus 1c Regular"],
        "text-field": ["get", "route_2_ref"],
        "icon-image": [
          "concat",
          ["get", "route_2_network"],
          "_",
          ["length", ["get", "route_2_ref"]]
        ],
        "icon-text-fit": "none",
        "icon-text-fit-padding": [2, 4, 2, 2],
        "text-anchor": "center",
        "text-justify": "center",
        "text-keep-upright": false,
        "text-pitch-alignment": "viewport",
        "symbol-z-order": "auto",
        "symbol-height-anchor": "ground",
        "icon-rotation-alignment": "viewport",
        "text-rotation-alignment": "viewport",
        "text-size": 10,
        "symbol-spacing": 300,
        "symbol-avoid-edges": false,
        "visibility": "visible"
      },
      paint: {
        "text-color": [
          "case",
          ["==", ["get", "route_2_network"], "US:I"],
          "#FFF",
          "#000"
        ]
      }
    },
    {
      id: "shield_highway",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "transportation_name",
      minzoom: 7,
      filter: [
        "all",
        [
          "in",
          ["get", "route_1_network"],
          ["literal", ["US:US", "US:I"]]
        ],
        ["<=", ["length", ["get", "route_1_ref"]], 3],
        ["has", "route_1_ref"]
      ],
      layout: {
        "symbol-placement": "line",
        "text-font": ["Rounded Mplus 1c Regular"],
        "text-field": ["get", "route_1_ref"],
        "icon-image": [
          "concat",
          ["get", "route_1_network"],
          "_",
          ["length", ["get", "route_1_ref"]]
        ],
        "icon-text-fit": "none",
        "icon-text-fit-padding": [2, 4, 2, 2],
        "text-anchor": "center",
        "text-justify": "center",
        "text-keep-upright": false,
        "text-pitch-alignment": "viewport",
        "symbol-z-order": "auto",
        "symbol-height-anchor": "ground",
        "icon-rotation-alignment": "viewport",
        "text-rotation-alignment": "viewport",
        "text-size": 10,
        "symbol-spacing": 300,
        "symbol-avoid-edges": false
      },
      paint: {
        "text-color": [
          "case",
          ["==", ["get", "route_1_network"], "US:I"],
          "#FFF",
          "#000"
        ]
      }
    },
    {
      id: "radar",
      type: "raster",
      source: "radar",
      paint: {
        "raster-fade-duration": 0,
        "raster-opacity": zoomInterp([8, 0.8], [13, 0.3]),
        "resampling": "nearest",
      }
    },
    {
      id: "stations",
      type: "symbol",
      source: "stations"
    },
    {
      id: "label_city",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      minzoom: 3,
      maxzoom: 13,
      filter: [
        "all",
        ["==", ["get", "class"], "city"]
      ],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": ["Rounded Mplus 1c Regular"],
        "symbol-placement": "point",
        "symbol-avoid-edges": true,
        "text-rotation-alignment": "auto",
        "text-size": 20,
        "text-max-width": 6.2,
        "text-anchor": "center",
        "text-allow-overlap": false,
        "text-overlap": "never",
        "text-ignore-placement": false,
        "text-optional": false,
        "text-padding": zoomInterp([7, 40], [10, 2])
      },
      paint: {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-color": "rgba(0, 0, 0, 1)",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    },
    {
      id: "label_town",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      minzoom: 9,
      filter: [
        "all",
        ["==", ["get", "class"], "town"]
      ],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": ["Rounded Mplus 1c Regular"],
        "symbol-placement": "point",
        "symbol-avoid-edges": false,
        "text-rotation-alignment": "auto",
        "text-size": 18,
        "text-max-width": 6.2
      },
      paint: {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-color": "rgba(0, 0, 0, 1)",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    },
    {
      id: "label_village",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      minzoom: 10,
      filter: [
        "all",
        [
          "in",
          ["get", "class"],
          ["literal", ["village", "hamlet"]]
        ]
      ],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": ["Rounded Mplus 1c Regular"],
        "symbol-placement": "point",
        "symbol-avoid-edges": false,
        "text-rotation-alignment": "auto",
        "visibility": "visible",
        "text-size": 16,
        "text-max-width": 6.2
      },
      paint: {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-color": "rgba(0, 0, 0, 1)",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    },
    {
      id: "label_road",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "transportation_name",
      minzoom: 10,
      filter: [
        "all",
        [
          "in",
          ["get", "class"],
          ["literal", ["primary", "secondary", "tertiary", "minor", "service", "track"]]
        ]
      ],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": ["Rounded Mplus 1c Regular"],
        "symbol-placement": "line",
        "symbol-avoid-edges": false,
        "text-rotation-alignment": "auto",
        "visibility": "visible",
        "text-size": zoomInterp([13, 10], [15, 16]),
        "text-max-width": 6.2,
        "symbol-height-anchor": "ground",
        "text-keep-upright": true
      },
      paint: {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-color": "rgba(0, 0, 0, 1)",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    }
  ]
};

export function styleJSON() {
  const obj: any = STYLE;
  obj.id = "obn0mke";
  console.log(obj);
  return JSON.stringify(obj, null, "  ");
}