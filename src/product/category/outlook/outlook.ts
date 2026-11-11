import { clearGeoJSONSource, OUTLOOK_SOURCE } from "../../../map/map";
import { createOutlookPoller } from "../../../network/noaa/mapserver";
import { FetchPoller } from "../../../network/util";
import { hideOutlookControls, OutlookButton, OutlookButtonRow, setOutlookControls } from "../../../uimods/timeline";
import { createProduct, ProductType } from "../../types";
import { CPC_OUTLOOK_ROWS, OutlookRow, SPC_CONVECTIVE_ROWS } from "./data";
// **DON'T** import UI !!! actually should be fine

let pollerStop: () => void = null;

function createOutlookProduct(name: string, rows: OutlookRow[]) {
    return createProduct({
        name: name,
        layers: ["wx_outlook", "wx_outlook_line", "wx_outlook_label"],

        // load: () => createOutlookPoller(OutlookPath.SPC_DAY1_CONVECTIVE)
        load: () => {
            const controls: OutlookButtonRow[] = rows.map(row => ({
                label: row.label,
                buttons: row.products.map(prod => ({
                    label: prod.label,
                    onclick: () => {
                        if (pollerStop) pollerStop();
                        clearGeoJSONSource(OUTLOOK_SOURCE());
                        pollerStop = createOutlookPoller(prod.URLs);
                    }
                }))
            }));

            setOutlookControls(controls);
            return () => {
                pollerStop();
                hideOutlookControls();
                pollerStop = null;
            };
        }
    });
}


export const OUTLOOK_PRODUCTS: ProductType[] = [
    createOutlookProduct("Categorical Outlook", SPC_CONVECTIVE_ROWS),
    createOutlookProduct("Climate Outlook", CPC_OUTLOOK_ROWS)
];