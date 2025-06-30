import { fetchDiscounts } from "@/data/services/discounts/DiscountServices";
import type { DiscountGetModel } from "@/domain/models/DiscountModel";

export async function fetchDiscountsAdminUseCase(): Promise<DiscountGetModel[]> {
  return await fetchDiscounts()
}
