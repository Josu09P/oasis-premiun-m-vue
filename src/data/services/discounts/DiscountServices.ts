// Archivo: src/data/services/discounts/DiscountService.ts
import { API_URL } from '@/data/api/ApiOasisBack'
import type { DiscountGetModel, DiscountPostModel, DiscountPutModel } from '@/domain/models/DiscountModel'

function getToken(): string {
  const data = localStorage.getItem("userDetailOasisPremiun")
  const parsed = data ? JSON.parse(data) : {}
  return parsed.token || ""
}

// GET - Listar todos los descuentos
export async function fetchDiscounts(): Promise<DiscountGetModel[]> {
  const res = await fetch(`${API_URL}/discounts`, {
    headers: { Authorization: getToken() },
  })
  if (!res.ok) throw new Error('Error al cargar descuentos')
  return await res.json()
}

// POST - Crear un nuevo descuento
export async function createDiscount(discountData: DiscountPostModel): Promise<DiscountGetModel> {
  const res = await fetch(`${API_URL}/discounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(),
    },
    body: JSON.stringify(discountData),
  })
  if (!res.ok) {
    const error = await res.text()
    console.error('Error creando descuento:', error)
    throw new Error('Error al crear el descuento')
  }
  return await res.json()
}

// DELETE - Eliminar descuento por ID
export async function deleteDiscountById(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/discounts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: getToken() },
  })
  if (!res.ok) throw new Error('Error al eliminar el descuento')
}

// GET - Obtener descuento por ID
export async function fetchDiscountById(id: number): Promise<DiscountGetModel> {
  const res = await fetch(`${API_URL}/discounts/${id}`, {
    headers: { Authorization: getToken() },
  })
  if (!res.ok) throw new Error('Error al obtener el descuento')
  return await res.json()
}

// PATCH - Actualizar descuento por ID
export async function updateDiscount(id: number, data: DiscountPutModel): Promise<DiscountGetModel> {
  const res = await fetch(`${API_URL}/discounts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(),
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.text()
    console.error('Error actualizando descuento:', error)
    throw new Error('Error al actualizar el descuento')
  }

  return await res.json()
}
