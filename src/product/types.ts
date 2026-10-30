export interface ProductCategory {
    name: string,
    items: (ProductSection | ProductType)[]
}
export function createCategory(name: string): ProductCategory {
    return {
        name,
        items: []
    };
}

export interface ProductSectionTemplate {
    name: string
}
interface ProductSection extends ProductSectionTemplate {
    isSection: true
}
export function createSection(category: ProductCategory, name: string) {
    category.items.push({
        name,
        isSection: true
    });
}

export interface ProductTypeTemplate {
    name: string,

    load(): () => void,
    layers: string[]
}
export interface ProductType extends ProductTypeTemplate {
    isSection: false
}
export function createProduct(product: ProductTypeTemplate) {
    (product as ProductType).isSection = false;
    return product as ProductType;
}