import { LAYER_CATEGORIES } from "../layers/categories";
import { LayerCategory, LayerType } from "../layers/types";
import { MAP } from "../map/map";

const QUICK_CONTROL_CONTAINER = document.getElementById("quick-controls") as HTMLElement;

function addQuickControl(text: string, toggled: boolean) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("bubble", "control");
    if (toggled) {
        button.classList.add("enabled");
    }
    button.addEventListener("click", () => button.classList.toggle("enabled"))

    QUICK_CONTROL_CONTAINER.append(button);
    return button;
}

addQuickControl("Show MDs", true);
addQuickControl("Show Alerts", true);
addQuickControl("Show Reports", false);
addQuickControl("Show Outlook", false);


// notebook

const NOTEBOOK = document.getElementById("notebook");
const NOTEBOOK_LABEL = document.getElementById("notebook-label");
const LAYER_DROPDOWN = document.getElementById("notebook-options");
const LAYER_BUTTONS: Map<LayerType, HTMLButtonElement> = new Map();
let currentCatContainer: HTMLDivElement = null;
let currentLayer: LayerType = null;
let currentLayerButton: HTMLButtonElement = null;

function selectLayer(layer: LayerType = null) {
    if (layer == currentLayer) {
        return;
    }

    currentLayer?.unload();
    currentLayerButton?.classList.remove("selected");

    if (currentLayer?.mapLayers != layer?.mapLayers) {
        currentLayer?.mapLayers.forEach(l => MAP.setLayoutProperty(l, "visibility", "none"));
        layer       ?.mapLayers.forEach(l => MAP.setLayoutProperty(l, "visibility", "visible"));
    }

    currentLayerButton = LAYER_BUTTONS.get(layer);
    currentLayerButton?.classList.add("selected");
    currentLayer = layer;
    currentLayer?.load();
}

function selectCategory(category: LayerCategory, container: HTMLDivElement) {
    if (container == currentCatContainer) {
        return;
    }

    currentCatContainer?.classList.remove("visible");
    currentCatContainer = container;
    currentCatContainer.classList.add("visible");
    NOTEBOOK_LABEL.textContent = category.name;
    LAYER_DROPDOWN.hidePopover();

    selectLayer(category.items.find(l => !l.isSection) as LayerType);
}

let first = true;
for (const category of LAYER_CATEGORIES) {
    const container = document.createElement("div");
    container.classList.add("notebook-category");

    // dropdown option
    const option = document.createElement("button");
    option.classList.add("notebook-item");
    option.textContent = category.name;
    option.addEventListener("click", () => selectCategory(category, container));
    LAYER_DROPDOWN.append(option);

    // actual category listing
    for (const item of category.items) {
        if (item.isSection) {
            const elem = document.createElement("div");
            elem.classList.add("notebook-header");
            elem.textContent = item.name;
            container.append(elem);
        }

        else {
            const layer = item as LayerType;
            const elem = document.createElement("button");
            elem.classList.add("notebook-item", "notebook-layer");
            elem.textContent = item.name;
            elem.addEventListener("click", () => selectLayer(layer));
            LAYER_BUTTONS.set(layer, elem);
            container.append(elem);
        }
    }

    if (first) {
        MAP.on("load", () => selectCategory(category, container));
        first = false;
    }

    NOTEBOOK.append(container);
}