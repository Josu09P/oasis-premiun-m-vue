import { fetchProductById } from "@/data/services/products/ProductsServices";
import type { ProductGetModel } from "@/domain/models/ProductsModel";

export async function fetchProductByIdUseCase(id: number): Promise<ProductGetModel> {
  return await fetchProductById(id)
}