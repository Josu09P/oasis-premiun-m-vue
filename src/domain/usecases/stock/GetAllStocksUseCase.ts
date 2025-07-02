// GetAllStocksUseCase.ts

import { fetchAllStocks } from '@/data/services/stock/StockServices'
import type { StockGetModel } from '@/domain/models/StockModel'

export async function getAllStocksUseCase(): Promise<StockGetModel[]> {
  return await fetchAllStocks()
}
