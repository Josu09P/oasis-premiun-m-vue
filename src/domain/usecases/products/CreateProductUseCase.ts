
import { createProduct } from '@/data/services/products/ProductsServices'
import type { ProductPostModel } from '@/domain/models/ProductsModel'

export async function createProductUseCase(formData: FormData): Promise<ProductPostModel> {
  return await createProduct(formData)
}
