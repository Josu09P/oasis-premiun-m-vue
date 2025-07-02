// domain/usecases/stock/UpdateStockUseCase.ts
import { updateStock } from '@/data/services/stock/StockServices'
import type { StockPutModel, StockGetModel } from '@/domain/models/StockModel'

export async function updateStockUseCase(id_product: number, data: StockPutModel): Promise<StockGetModel> {
  return await updateStock(id_product, data)
}
