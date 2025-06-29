import { deleteProductById } from "@/data/services/products/ProductsServices";

export async function deleteProductByIdUseCase(id: number): Promise<void> {
  return await deleteProductById(id)
}
