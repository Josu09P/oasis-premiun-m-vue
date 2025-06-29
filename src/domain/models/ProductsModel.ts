export interface ProductGetModel {
  id: number;
  name: string;
  description: string;
  price: number;
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  created_at?: string;
  updated_at?: string;
  id_category?: {
    id: number;
  };
  category?: {
    name: string;
}
}

export interface ProductPostModel {
  name: string;
  description: string;
  price: number;
  id_category: number;
}

export interface ProductPutModel {
  name?: string;
  description?: string;
  price?: number;
  id_category?: number;
  images_to_update?: number[];
}