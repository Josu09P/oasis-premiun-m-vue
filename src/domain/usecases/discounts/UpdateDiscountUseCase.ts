
import { updateDiscount } from '@/data/services/discounts/DiscountServices'
import type { DiscountGetModel, DiscountPutModel,  } from '@/domain/models/DiscountModel'

export async function updateDiscountUseCase(
  id: number,
  data: DiscountPutModel
): Promise<DiscountGetModel> {
  return await updateDiscount(id, data)
}
