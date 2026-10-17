import { MAP } from "../../map/map";
import { createCategory, createLayer, createSection } from "../types";

export const MRMS_CATEGORY = createCategory("MRMS");

createSection("Level III");

createLayer({
    name: "Reflectivity",
    mapLayers: [""],
    load: () => {},
    unload: () => {}
})


