export interface CategoriesGetModel {
    id: number;
    name: string;
    description: string;
    image: string;
    created_at?: string;
    updated_at?: string;
}

export interface CategoriesPostModel {
    name: string;
    description: string;
    image: string;
}

export interface CategoriesPutModel {
    name?: string;
    description?: string;
    image?: string; 
}