// domain/usecases/stock/DeleteStockUseCase.ts
import { deleteStock } from '@/data/services/stock/StockServices'

export async function deleteStockUseCase(id_product: number): Promise<void> {
  return await deleteStock(id_product)
}
