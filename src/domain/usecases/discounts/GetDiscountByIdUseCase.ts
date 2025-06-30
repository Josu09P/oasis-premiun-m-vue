
import { fetchDiscountById } from '@/data/services/discounts/DiscountServices'
import type { DiscountGetModel } from '@/domain/models/DiscountModel'

export async function fetchDiscountByIdUseCase(id: number): Promise<DiscountGetModel> {
  return await fetchDiscountById(id)
}
