let currentCategory: LayerCategory;

export interface LayerCategory {
    name: string,
    items: (LayerSection | LayerType)[]
}
export function createCategory(name: string): LayerCategory {
    currentCategory = {
        name,
        items: []
    };

    return currentCategory;
}

export interface LayerSectionTemplate {
    name: string
}
interface LayerSection extends LayerSectionTemplate {
    isSection: true
}
export function createSection(name: string) {
    currentCategory.items.push({
        name,
        isSection: true
    });
}

export interface LayerTypeTemplate {
    name: string,

    load: () => void,
    unload: () => void,
    mapLayers: string[]
}
export interface LayerType extends LayerTypeTemplate {
    isSection: false
}
export function createLayer(layer: LayerTypeTemplate) {
    (layer as LayerType).isSection = false;
    currentCategory.items.push(layer as LayerType);
}