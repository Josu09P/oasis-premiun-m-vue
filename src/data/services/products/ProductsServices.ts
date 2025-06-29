import { API_URL } from "@/data/api/ApiOasisBack"
import type {
  ProductGetModel,
  ProductPostModel,
} from '@/domain/models/ProductsModel'

function getToken(): string {
  const data = localStorage.getItem('userDetailOasisPremiun')
  const parsed = data ? JSON.parse(data) : {}
  return parsed.token || ''
}

// GET: Todos los productos
export async function fetchProducts(): Promise<ProductGetModel[]> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar los productos')
  }

  return await response.json()
}

// GET: Producto por ID
export async function fetchProductById(id: number): Promise<ProductGetModel> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Error al obtener producto:', response.status, err)
    throw new Error('Error al obtener el producto')
  }

  return await response.json()
}


// GET: Buscar productos por nombre
export async function searchProducts(name: string): Promise<ProductGetModel[]> {
  const response = await fetch(`${API_URL}/products/search/${encodeURIComponent(name)}`, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    throw new Error('Error al buscar productos')
  }

  return await response.json()
}

// POST: Crear producto con imágenes
export async function createProduct(formData: FormData): Promise<ProductPostModel> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      Authorization: getToken(),
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Error al crear producto:', error)
    throw new Error('Error al crear producto')
  }

  return await response.json()
}

export async function updateProductFormData(
  id: number,
  data: {
    name: string
    description: string
    price: number | string
    id_category: number | string
    images_to_update: number[]
  },
  files: File[]
): Promise<ProductGetModel> {
  const formData = new FormData();

  // Corrige tipos por si vienen como strings
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('price', String(Number(data.price)));
  formData.append('id_category', String(Number(data.id_category)));

  if (Array.isArray(data.images_to_update)) {
    data.images_to_update.forEach((idx) => {
      formData.append('images_to_update', String(idx));
    });
  }

  if (files.length > 0) {
    files.forEach((file) => {
      formData.append('files[]', file);
    });
  }

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: getToken(),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error al actualizar producto:', error);
    throw new Error(error.message || 'Error al actualizar producto');
  }

  return await response.json();
}
  
// DELETE: Eliminar producto
export async function deleteProductById(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Error al eliminar producto:', error)
    throw new Error('Error al eliminar producto')
  }
}

// GET: Productos paginados
export async function fetchPaginatedProducts(page = 1, limit = 8): Promise<ProductGetModel[]> {
  const response = await fetch(`${API_URL}/products/pagination?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar productos paginados')
  }

  const data = await response.json()
  return data.items ?? data.products ?? data
}

// GET: Productos por categoría
export async function fetchProductsByCategory(categoryId: number): Promise<ProductGetModel[]> {
  const response = await fetch(`${API_URL}/products/category/${categoryId}`, {
    method: 'GET',
    headers: {
      Authorization: getToken(),
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar productos por categoría')
  }

  return await response.json()
}
