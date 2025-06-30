import { createDiscount } from "@/data/services/discounts/DiscountServices"
import type { DiscountGetModel, DiscountPostModel } from "@/domain/models/DiscountModel"

export async function createDiscountUseCase(data: DiscountPostModel): Promise<DiscountGetModel> {
  return await createDiscount(data)
}
