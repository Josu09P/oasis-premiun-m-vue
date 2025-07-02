import { updateStock } from '@/data/services/stock/StockServices'
import type { StockGetModel, StockPutModel } from '@/domain/models/StockModel'

export async function addStockUseCase(id_product: number, cantidad: number): Promise<StockGetModel> {
  const { user_id } = JSON.parse(localStorage.getItem('userDetailOasisPremiun') || '{}')

  const data: StockPutModel & { user_id: number } = {
    quantity: cantidad,
    user_id: user_id,
  }

  return await updateStock(id_product, data)
}
