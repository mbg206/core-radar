import { MAP } from "../map/map";
import { CATEGORIES } from "../product/category/categories";
import { loadProduct } from "../product/manager";
import { ProductCategory, ProductType } from "../product/types";

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
// addQuickControl("Show Outlook", false);


// notebook

const NOTEBOOK = document.getElementById("notebook");
const NOTEBOOK_LABEL = document.getElementById("notebook-label");
const PRODUCT_DROPDOWN = document.getElementById("notebook-options");
const PRODUCT_BUTTONS: Map<ProductType, HTMLButtonElement> = new Map();
let currentCatContainer: HTMLDivElement = null;

function selectCategory(category: ProductCategory, container: HTMLDivElement) {
    if (container == currentCatContainer) {
        return;
    }

    currentCatContainer?.classList.remove("visible");
    currentCatContainer = container;
    currentCatContainer.classList.add("visible");
    NOTEBOOK_LABEL.textContent = category.name;
    PRODUCT_DROPDOWN.hidePopover();

    loadProduct(category.items.find(l => !l.isSection) as ProductType, PRODUCT_BUTTONS);
}

let first = true;
for (const category of CATEGORIES) {
    const container = document.createElement("div");
    container.classList.add("notebook-category");

    // dropdown option
    const option = document.createElement("button");
    option.classList.add("notebook-item");
    option.textContent = category.name;
    option.addEventListener("click", () => selectCategory(category, container));
    PRODUCT_DROPDOWN.append(option);

    // actual category listing
    for (const item of category.items) {
        if (item.isSection) {
            const elem = document.createElement("div");
            elem.classList.add("notebook-header");
            elem.textContent = item.name;
            container.append(elem);
        }

        else {
            const product = item as ProductType;
            const elem = document.createElement("button");
            elem.classList.add("notebook-item", "notebook-product");
            elem.textContent = item.name;
            elem.addEventListener("click", () => loadProduct(product, PRODUCT_BUTTONS));
            PRODUCT_BUTTONS.set(product, elem);
            container.append(elem);
        }
    }

    if (first) {
        MAP.on("load", () => selectCategory(category, container));
        first = false;
    }

    NOTEBOOK.append(container);
}