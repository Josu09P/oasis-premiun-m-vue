import { fetchProducts } from "@/data/services/products/ProductsServices";
import type { ProductGetModel } from "@/domain/models/ProductsModel";

export async function fetchProductsUseCase(): Promise<ProductGetModel[]> {
  return await fetchProducts()
}