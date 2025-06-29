import { deleteCategoryById } from "@/data/services/categories/CategoriesServices";

export async function deleteCategoryUseCase(id: number): Promise<void> {
  return await deleteCategoryById(id)
}