import { MAP } from "../../map/map";
import { createCategory, createLayer, createSection } from "../types";

export const OUTLOOK_CATEGORY = createCategory("Outlook");

createSection("SPC");

createLayer({
    name: "Reflectivity",
    mapLayers: [""],
    load: () => console.log("LOAD"),
    unload: () => console.log("unLOAD")
});


