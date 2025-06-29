import { fetchPaginatedProducts } from "@/data/services/products/ProductsServices";
import type { ProductGetModel } from "@/domain/models/ProductsModel";

export async function fetchPaginatedProductsUseCase(page = 1, limit = 8): Promise<ProductGetModel[]> {
  return await fetchPaginatedProducts(page, limit)
}