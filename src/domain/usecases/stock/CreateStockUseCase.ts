// domain/usecases/stock/CreateStockUseCase.ts
import { createStock } from '@/data/services/stock/StockServices'
import type { StockPostModel, StockGetModel } from '@/domain/models/StockModel'

export async function createStockUseCase(data: StockPostModel): Promise<StockGetModel> {
  return await createStock(data)
}
