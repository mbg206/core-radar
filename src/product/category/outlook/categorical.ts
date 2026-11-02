import { createCategoricalOutlookPoller, createOutlookPoller, OutlookPath } from "../../../network/noaa/mapserver";
import { createProduct, ProductType } from "../../types";

function createOutlookProduct(name: string) {
    return createProduct({
        name: name,
        layers: ["wx_outlook", "wx_outlook_line", "wx_outlook_label"],

        // load: () => createOutlookPoller(OutlookPath.SPC_DAY1_CONVECTIVE)
        load: () => createCategoricalOutlookPoller("", "")
    });
}


export const CATEGORICAL_PRODUCTS: ProductType[] = [
    createOutlookProduct("Categorical Outlook")
];