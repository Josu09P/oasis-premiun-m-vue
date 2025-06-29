import { fetchProductsByCategory } from "@/data/services/products/ProductsServices";
import type { ProductGetModel } from "@/domain/models/ProductsModel";

export async function fetchProductsByCategoryUseCase(categoryId: number): Promise<ProductGetModel[]> {
  return await fetchProductsByCategory(categoryId)
}