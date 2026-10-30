import { createCategory, ProductCategory } from "../types";
import { CATEGORICAL_PRODUCTS } from "./outlook/categorical";

const OUTLOOK_CATEGORY: ProductCategory = {
    name: "Outlooks",
    items: CATEGORICAL_PRODUCTS
};


export const CATEGORIES: ProductCategory[] = [OUTLOOK_CATEGORY];