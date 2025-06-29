import { updateCategoryByIdWithImage } from "@/data/services/categories/CategoriesServices";

export async function updateCategoryUseCase(id: number, formData: FormData) {
  return await updateCategoryByIdWithImage(id, formData)
}