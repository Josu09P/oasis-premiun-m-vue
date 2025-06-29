import { fetchCategories } from "@/data/services/categories/CategoriesServices";
import type { CategoriesGetModel } from "@/domain/models/CategoriesModel";

export async function fetchCategoriesUseCase(): Promise<CategoriesGetModel[]> {
  return await fetchCategories()
}