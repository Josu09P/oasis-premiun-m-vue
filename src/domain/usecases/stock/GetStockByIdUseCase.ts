// domain/usecases/stock/GetStockByIdUseCase.ts
import { fetchStockById } from '@/data/services/stock/StockServices'
import type { StockGetModel } from '@/domain/models/StockModel'

export async function getStockByIdUseCase(id: number): Promise<StockGetModel> {
  return await fetchStockById(id)
}
