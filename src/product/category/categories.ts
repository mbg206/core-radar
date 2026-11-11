import { createCategory, ProductCategory } from "../types";
import { OUTLOOK_PRODUCTS } from "./outlook/outlook";

const OUTLOOK_CATEGORY: ProductCategory = {
    name: "Outlooks",
    items: OUTLOOK_PRODUCTS
};


export const CATEGORIES: ProductCategory[] = [OUTLOOK_CATEGORY];