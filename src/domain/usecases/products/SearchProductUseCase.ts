import { searchProducts } from "@/data/services/products/ProductsServices";
import type { ProductGetModel } from "@/domain/models/ProductsModel";

export async function searchProductsUseCase(name: string): Promise<ProductGetModel[]> {
  return await searchProducts(name)
  
}