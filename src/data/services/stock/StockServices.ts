//data/services/stock/StockServices.ts

import { API_URL } from '@/data/api/ApiOasisBack'
import type { StockGetModel, StockPostModel, StockPutModel } from '@/domain/models/StockModel'

function getToken(): string {
  const data = localStorage.getItem('userDetailOasisPremiun')
  const parsed = data ? JSON.parse(data) : {}
  return parsed.token || ''
}

// GET: Obtener stock por ID de producto
export async function fetchStockByProduct(id_product: number): Promise<StockGetModel> {
  
  const response = await fetch(`${API_URL}/stocks/${id_product}`, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el stock del producto')
  }

  return await response.json()
}

// POST: Crear stock
export async function createStock(data: StockPostModel): Promise<StockGetModel> {
  const response = await fetch(`${API_URL}/stocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al crear el stock')
  }

  return await response.json()
}

// PUT: Actualizar stock
export async function updateStock(id_product: number, data: StockPutModel): Promise<StockGetModel> {
  const response = await fetch(`${API_URL}/stocks/${id_product}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el stock')
  }

  return await response.json()
}

// DELETE: Eliminar stock por producto
export async function deleteStock(id_product: number): Promise<void> {
  const response = await fetch(`${API_URL}/stocks/${id_product}`, {
    method: 'DELETE',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el stock')
  }
}

// GET: Obtener todos los stocks
export async function fetchAllStocks(): Promise<StockGetModel[]> {
  const response = await fetch(`${API_URL}/stocks`, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener todos los stocks')
  }

  return await response.json()
}

// GET: Obtener stock por ID de stock
export async function fetchStockById(id: number): Promise<StockGetModel> {
  const response = await fetch(`${API_URL}/stocks/find/by-id/${id}`, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el stock')
  }

  return await response.json()
}