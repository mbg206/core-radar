import { OutlookPath } from "../../../network/noaa/mapserver";

export interface OutlookProduct {
    label: string;
    URLs: string[];
}
export interface OutlookRow {
    label: string;
    products: OutlookProduct[];
}

export const SPC_CONVECTIVE_ROWS: OutlookRow[] = [
    {
        label: "Day 1",
        products: [
            {
                label: "Categorical",
                URLs: [OutlookPath.SPC_DAY1_CATEGORICAL]
            },
            {
                label: "Tornado",
                URLs: [OutlookPath.SPC_DAY1_TOR_PROB, OutlookPath.SPC_DAY1_TOR_INT]
            },
            {
                label: "Wind",
                URLs: [OutlookPath.SPC_DAY1_WIND_PROB, OutlookPath.SPC_DAY1_WIND_INT]
            },
            {
                label: "Hail",
                URLs: [OutlookPath.SPC_DAY1_HAIL_PROB, OutlookPath.SPC_DAY1_HAIL_INT]
            }
        ]
    },
    {
        label: "Day 2",
        products: [
            {
                label: "Categorical",
                URLs: [OutlookPath.SPC_DAY2_CATEGORICAL]
            },
            {
                label: "Tornado",
                URLs: [OutlookPath.SPC_DAY2_TOR_PROB, OutlookPath.SPC_DAY2_TOR_INT]
            },
            {
                label: "Wind",
                URLs: [OutlookPath.SPC_DAY2_WIND_PROB, OutlookPath.SPC_DAY2_WIND_INT]
            },
            {
                label: "Hail",
                URLs: [OutlookPath.SPC_DAY2_HAIL_PROB, OutlookPath.SPC_DAY2_HAIL_INT]
            }
        ]
    },
    {
        label: "Day 3",
        products: [
            {
                label: "Categorical",
                URLs: [OutlookPath.SPC_DAY3_CATEGORICAL]
            },
            {
                label: "Probabilistic",
                URLs: [OutlookPath.SPC_DAY3_SVR_PROB, OutlookPath.SPC_DAY3_SVR_INT]
            }
        ]
    },
    {
        label: "Day 4",
        products: [{
            label: "Probabilistic",
            URLs: [OutlookPath.SPC_DAY4_SVR_PROB]
        }]
    },
    {
        label: "Day 5",
        products: [{
            label: "Probabilistic",
            URLs: [OutlookPath.SPC_DAY5_SVR_PROB]
        }]
    },
    {
        label: "Day 6",
        products: [{
            label: "Probabilistic",
            URLs: [OutlookPath.SPC_DAY6_SVR_PROB]
        }]
    },
    {
        label: "Day 7",
        products: [{
            label: "Probabilistic",
            URLs: [OutlookPath.SPC_DAY7_SVR_PROB]
        }]
    },
    {
        label: "Day 8",
        products: [{
            label: "Probabilistic",
            URLs: [OutlookPath.SPC_DAY8_SVR_PROB]
        }]
    },
];

export const CPC_OUTLOOK_ROWS: OutlookRow[] = [
    {
        label: "Day 6-10",
        products: [
            {
                label: "Temperature",
                URLs: [OutlookPath.CPC_6_10_TEMP]
            },
            {
                label: "Precipitation",
                URLs: [OutlookPath.CPC_6_10_PRECIP]
            }
        ]
    },
    {
        label: "Day 8-14",
        products: [
            {
                label: "Temperature",
                URLs: [OutlookPath.CPC_8_14_TEMP]
            },
            {
                label: "Precipitation",
                URLs: [OutlookPath.CPC_8_14_PRECIP]
            }
        ]
    },
    {
        label: "Monthly",
        products: [
            {
                label: "Temperature",
                URLs: [OutlookPath.CPC_MTHLY_TEMP]
            },
            {
                label: "Precipitation",
                URLs: [OutlookPath.CPC_MTHLY_PRECIP]
            }
        ]
    },
    {
        label: "Seasonal",
        products: [
            {
                label: "Temperature",
                URLs: [OutlookPath.CPC_SEAS_TEMP]
            },
            {
                label: "Precipitation",
                URLs: [OutlookPath.CPC_SEAS_PRECIP]
            }
        ]
    },
];