import { createCategory } from "@/data/services/categories/CategoriesServices";
import type { CategoriesPostModel } from "@/domain/models/CategoriesModel";

export async function createCategoryUseCase(formData: FormData): Promise<CategoriesPostModel> {
  return await createCategory(formData)
}