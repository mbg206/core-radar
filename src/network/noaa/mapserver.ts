import { FetchPoller, MINUTES } from "../util";
import { OUTLOOK_SOURCE } from "../../map/map";
import { FeatureCollection } from "geojson";

/**
 * @param path put probabilistic outlook link *before* conditional intensity link
 */
export function createOutlookPoller(path: string[]) {
    const poller = new FetchPoller(
        10*MINUTES,
        path.map(p => p + "/query?where=1%3D1&f=geojson&outSR=4326&outFields=*"),
        (data: FeatureCollection[]) => {
            if (data.length == 1) {
                const res = data[0];
                if ((res as any).error) throw new Error("NOAA mapserver returned error value!");

                res.features = res.features.filter((f) => f.properties.cat != "EC");
                fixStyle(res, path[0]);
                
                return OUTLOOK_SOURCE().setData(data[0]);
            }

            const prob = data[0];
            const cond = data[1];
            if (
                prob.features.length > 0 &&
                cond.features.length > 0 &&
                prob.features[0].properties.issue != cond.features[0].properties.issue
            ) throw new Error("Mismatch between probabilistic and intensity issue times");
            // should probably be throw due to future "date/time updated" code i might add to poller
            
            prob.features.forEach((f) => {
                if (!isNaN(f.properties.label)) {
                    f.properties.label = (parseFloat(f.properties.label) * 100) + "%";
                }
            });

            prob.features.push(...cond.features);
            OUTLOOK_SOURCE().setData(prob);
        }
    );

    return () => poller.stop();
}

function fixStyle(data: FeatureCollection, path: string) {
    if (!STYLE_FIXERS.has(path)) return;

    const fixer = STYLE_FIXERS.get(path);
    fixer(data);
}

// this *should* work but is untested since it's fall...
// for some reason the layer returns fill/stroke data for
// *only* day 4, not 5-8
function fixDay5Outlook(data: FeatureCollection) {
    data.features.forEach(f => {
        f.properties.stroke = "#6E6E6E";

        if (f.properties.dn == 15) {
            f.properties.label = "15%";
            f.properties.fill = "#FFFF00";
        }
        else {
            f.properties.label = "30%";
            f.properties.fill = "#E69800";
        }
    });
}

function fixTempOutlook(data: FeatureCollection) {
    data.features.forEach(f => {
        const prob = f.properties.prob;

        f.properties.label = `${f.properties.cat}, ${prob}%`;

        f.properties.stroke = "#6E6E6E";
        if (f.properties.cat == "Above") {
            if (prob < 40) {
                f.properties.fill = "#E7B168";
            }
            else if (prob < 50) {
                f.properties.fill = "#E38B4B";
            }
            else if (prob < 60) {
                f.properties.fill = "#DA5731";
            }
            else if (prob < 70) {
                f.properties.fill = "#C93B1A";
            }
            else if (prob < 80) {
                f.properties.fill = "#B32E05";
            }
            else if (prob < 90) {
                f.properties.fill = "#912600";
            }
            else {
                f.properties.fill = "#702100";
            }
        }
        else if (f.properties.cat == "Below") {
            if (prob < 40) {
                f.properties.fill = "#BFCBE4";
            }
            else if (prob < 50) {
                f.properties.fill = "#A0C0DF";
            }
            else if (prob < 60) {
                f.properties.fill = "#77B5E2";
            }
            else if (prob < 70) {
                f.properties.fill = "#389FDC";
            }
            else if (prob < 80) {
                f.properties.fill = "#005DA1";
            }
            else if (prob < 90) {
                f.properties.fill = "#2E216F";
            }
            else {
                f.properties.fill = "#221852";
            }
        }
        else { // "Normal"
            f.properties.fill = prob < 40 ? "#D7D9D9" : "#A0A0A0";
        }
    });
}

function fixPrecipOutlook(data: FeatureCollection) {
    data.features.forEach(f => {
        const prob = f.properties.prob;

        f.properties.label = `${f.properties.cat}, ${prob}%`;

        f.properties.stroke = "#6E6E6E";
        if (f.properties.cat == "Above") {
            if (prob < 40) {
                f.properties.fill = "#B3D9AB";
            }
            else if (prob < 50) {
                f.properties.fill = "#95CE7F";
            }
            else if (prob < 60) {
                f.properties.fill = "#48B430";
            }
            else if (prob < 70) {
                f.properties.fill = "#009620";
            }
            else if (prob < 80) {
                f.properties.fill = "#007814";
            }
            else if (prob < 90) {
                f.properties.fill = "#28600A";
            }
            else {
                f.properties.fill = "#285300";
            }
        }
        else if (f.properties.cat == "Below") {
            if (prob < 40) {
                f.properties.fill = "#F0D493";
            }
            else if (prob < 50) {
                f.properties.fill = "#D8A74F";
            }
            else if (prob < 60) {
                f.properties.fill = "#BB6D33";
            }
            else if (prob < 70) {
                f.properties.fill = "#9B5031";
            }
            else if (prob < 80) {
                f.properties.fill = "#934639";
            }
            else if (prob < 90) {
                f.properties.fill = "#804000";
            }
            else {
                f.properties.fill = "#4F2F2F";
            }
        }
        else { // "Normal"
            f.properties.fill = prob < 40 ? "#D7D9D9" : "#A0A0A0";
        }
    });
}

const V = "https://mapservices.weather.noaa.gov/vector/rest/services/";
const R = "https://mapservices.weather.noaa.gov/raster/rest/services/";
const T = "https://mapservices.weather.noaa.gov/tropical/rest/services/";

export const OutlookPath = {
    SPC_DAY1_CATEGORICAL: V+"outlooks/SPC_wx_outlks/MapServer/1",
    SPC_DAY1_TOR_INT:     V+"outlooks/SPC_wx_outlks/MapServer/2",
    SPC_DAY1_TOR_PROB:    V+"outlooks/SPC_wx_outlks/MapServer/3",
    SPC_DAY1_HAIL_INT:    V+"outlooks/SPC_wx_outlks/MapServer/4",
    SPC_DAY1_HAIL_PROB:   V+"outlooks/SPC_wx_outlks/MapServer/5",
    SPC_DAY1_WIND_INT:    V+"outlooks/SPC_wx_outlks/MapServer/6",
    SPC_DAY1_WIND_PROB:   V+"outlooks/SPC_wx_outlks/MapServer/7",

    SPC_DAY2_CATEGORICAL: V+"outlooks/SPC_wx_outlks/MapServer/9",
    SPC_DAY2_TOR_INT:     V+"outlooks/SPC_wx_outlks/MapServer/10",
    SPC_DAY2_TOR_PROB:    V+"outlooks/SPC_wx_outlks/MapServer/11",
    SPC_DAY2_HAIL_INT:    V+"outlooks/SPC_wx_outlks/MapServer/12",
    SPC_DAY2_HAIL_PROB:   V+"outlooks/SPC_wx_outlks/MapServer/13",
    SPC_DAY2_WIND_INT:    V+"outlooks/SPC_wx_outlks/MapServer/14",
    SPC_DAY2_WIND_PROB:   V+"outlooks/SPC_wx_outlks/MapServer/15",

    SPC_DAY3_CATEGORICAL: V+"outlooks/SPC_wx_outlks/MapServer/17",
    SPC_DAY3_SVR_INT:     V+"outlooks/SPC_wx_outlks/MapServer/18",
    SPC_DAY3_SVR_PROB:    V+"outlooks/SPC_wx_outlks/MapServer/19",

    SPC_DAY4_SVR_PROB: V+"outlooks/SPC_wx_outlks/MapServer/21",
    SPC_DAY5_SVR_PROB: V+"outlooks/SPC_wx_outlks/MapServer/22",
    SPC_DAY6_SVR_PROB: V+"outlooks/SPC_wx_outlks/MapServer/23",
    SPC_DAY7_SVR_PROB: V+"outlooks/SPC_wx_outlks/MapServer/24",
    SPC_DAY8_SVR_PROB: V+"outlooks/SPC_wx_outlks/MapServer/25",

    CPC_6_10_TEMP:    V+"outlooks/cpc_6_10_day_outlk/MapServer/0",
    CPC_6_10_PRECIP:  V+"outlooks/cpc_6_10_day_outlk/MapServer/1",
    CPC_8_14_TEMP:    V+"outlooks/cpc_8_14_day_outlk/MapServer/0",
    CPC_8_14_PRECIP:  V+"outlooks/cpc_8_14_day_outlk/MapServer/1",
    CPC_MTHLY_TEMP:   V+"outlooks/cpc_mthly_temp_outlk/MapServer/0",
    CPC_MTHLY_PRECIP: V+"outlooks/cpc_mthly_precip_outlk/MapServer/0",
    CPC_SEAS_TEMP:    V+"outlooks/cpc_sea_temp_outlk/MapServer/0", // has many more layers, but this is probably the only useful one
    CPC_SEAS_PRECIP:  V+"outlooks/cpc_sea_precip_outlk/MapServer/0",
};

const STYLE_FIXERS = new Map<string, (data: FeatureCollection) => void>([
    [OutlookPath.SPC_DAY5_SVR_PROB, fixDay5Outlook],
    [OutlookPath.SPC_DAY6_SVR_PROB, fixDay5Outlook],
    [OutlookPath.SPC_DAY7_SVR_PROB, fixDay5Outlook],
    [OutlookPath.SPC_DAY8_SVR_PROB, fixDay5Outlook],

    [OutlookPath.CPC_6_10_TEMP, fixTempOutlook],
    [OutlookPath.CPC_8_14_TEMP, fixTempOutlook],
    [OutlookPath.CPC_MTHLY_TEMP, fixTempOutlook],
    [OutlookPath.CPC_SEAS_TEMP, fixTempOutlook],

    [OutlookPath.CPC_6_10_PRECIP, fixPrecipOutlook],
    [OutlookPath.CPC_8_14_PRECIP, fixPrecipOutlook],
    [OutlookPath.CPC_MTHLY_PRECIP, fixPrecipOutlook],
    [OutlookPath.CPC_SEAS_PRECIP, fixPrecipOutlook],
]);
