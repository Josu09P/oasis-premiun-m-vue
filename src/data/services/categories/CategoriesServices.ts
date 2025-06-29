
import { API_URL } from '@/data/api/ApiOasisBack'
import type { CategoriesGetModel, CategoriesPostModel } from '@/domain/models/CategoriesModel'


function getToken(): string {
  const data = localStorage.getItem('userDetailOasisPremiun')
  const parsed = data ? JSON.parse(data) : {}
  return parsed.token || ''
}

// ✅ GET: Todas las categorías
export async function fetchCategories(): Promise<CategoriesGetModel[]> {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar las categorías')
  }

  return await response.json()
}

// POST: Crear nueva categoría
export async function createCategory(formData: FormData): Promise<CategoriesPostModel> {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: {
      Authorization: getToken(),
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Error al crear categoría:', error)
    throw new Error('Error al crear categoría')
  }

  return await response.json()
}

// DELETE: Eliminar categoría por ID
export async function deleteCategoryById(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Error al eliminar categoría:', error)
    throw new Error('Error al eliminar categoría')
  }
}

// PUT: Actualizar categoría con imagen
export async function updateCategoryByIdWithImage(id: number, formData: FormData) {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: getToken(),
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Error al actualizar con imagen:', error)
    throw new Error('Error al actualizar categoría con imagen')
  }

  return await response.json()
}

// ✅ GET: Obtener categoría por ID
export async function fetchCategoryById(id: number): Promise<CategoriesGetModel> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar la categoría')
  }

  return await response.json()
}
