import { MAP } from "../map/map";
import { ProductType } from "./types";

let currentProduct: ProductType = null;
let unload: () => void;

export function loadProduct(product: ProductType, buttons: Map<ProductType, HTMLButtonElement>) {
    if (product == currentProduct) return;

    if (currentProduct != null) {
        buttons.get(currentProduct).classList.remove("selected");
        unload();
        currentProduct.layers.forEach(layer =>
            MAP.setLayoutProperty(layer, "visibility", "none", {validate: false})
        );
    }
    
    currentProduct = product;
    product.layers.forEach(layer =>
        MAP.setLayoutProperty(layer, "visibility", "visible", {validate: false})
    );
    unload = product.load();
    buttons.get(product).classList.add("selected");
}