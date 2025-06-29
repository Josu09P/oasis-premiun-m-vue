import { updateProductFormData } from "@/data/services/products/ProductsServices";
import type { ProductGetModel } from "@/domain/models/ProductsModel";

interface UpdateProductPayload {
  name: string;
  description: string;
  price: number | string;
  id_category: number | string;
  images_to_update: number[];
}

export async function updateProductWithImagesUseCase(
  id: number,
  data: UpdateProductPayload,
  files: File[]
): Promise<ProductGetModel> {
  return await updateProductFormData(id, data, files);
}
