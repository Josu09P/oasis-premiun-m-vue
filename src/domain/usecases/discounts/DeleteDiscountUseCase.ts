import { deleteDiscountById } from "@/data/services/discounts/DiscountServices";

export async function deleteDiscountUseCase(id: number): Promise<void> {
  return await deleteDiscountById(id)
}
