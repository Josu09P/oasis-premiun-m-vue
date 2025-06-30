// src/domain/models/DiscountModel.ts

export interface DiscountPostModel {
  name: string
  description: string
  slogan: string
  amount: number
  startDate: string
  endDate: string
  productId: number
}


export interface DiscountGetModel {
  id: number
  name: string
  description: string
  slogan: string
  amount: number
  status: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  product: {
    id: number
    name: string
    price: string
  }

}

export interface DiscountPutModel {
  name: string
  description: string
  slogan: string
  amount: number
  startDate: string
  endDate: string
  productId: number
}
