// domain/models/StockModel.ts

export interface StockGetModel {
  id: number
  id_product: number
  quantity: number
  created_at?: string
  updated_at?: string | null
  product: {
    id: number
    name: string
  }
}

export interface StockPostModel {
  id_product: number;
  quantity: number;
}

export interface StockPutModel {
  quantity?: number;
}
