import { fetchCategoryById } from "@/data/services/categories/CategoriesServices";
import type { CategoriesGetModel } from "@/domain/models/CategoriesModel";

export async function fetchCategoryByIdUseCase(id: number): Promise<CategoriesGetModel> {
  return await fetchCategoryById(id)
}