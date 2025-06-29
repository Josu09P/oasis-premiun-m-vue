import { API_URL } from "@/data/api/ApiOasisBack"
import type { CarouselGetModel, CarouselPostModel } from "@/domain/models/CarouselModel"

function getToken(): string {
    const data = localStorage.getItem("userDetailOasisPremiun")
    const parsed = data ? JSON.parse(data) : {}
    return parsed.token || ""
}

export async function fetchCarousels(): Promise<CarouselGetModel[]> {
    const res = await fetch(`${API_URL}/carousel`, {
        headers: { Authorization: getToken() },
    })
    if (!res.ok) throw new Error("Error al cargar carruseles")
    return await res.json()
}

export async function fetchCarouselsAdmin(): Promise<CarouselGetModel[]> {
    const res = await fetch(`${API_URL}/carousel/admin`, {
        headers: { Authorization: getToken() },
    })
    if (!res.ok) throw new Error("Error al cargar carruseles para admin")
    return await res.json()
}

export async function createCarousel(formData: FormData): Promise<CarouselPostModel> {
    const res = await fetch(`${API_URL}/carousel`, {
        method: "POST",
        headers: { Authorization: getToken() },
        body: formData,
    })
    if (!res.ok) throw new Error("Error al crear carrusel")
    return await res.json()
}

export async function deleteCarouselById(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/carousel/${id}`, {
        method: "DELETE",
        headers: { Authorization: getToken() },
    })
    if (!res.ok) throw new Error("Error al eliminar carrusel")
}

// PUT
export async function updateCarouselFormData(
  id: number,
  data: {
    title?: string;
    description?: string;
    is_enabled?: boolean;
    images_to_update?: number[];
  },
  files: File[]
): Promise<CarouselGetModel> {
  const formData = new FormData();

  // Campos de texto
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (typeof data.is_enabled !== 'undefined') {
    formData.append('is_enabled', String(data.is_enabled));
  }

  // Índices de imágenes a actualizar
  if (Array.isArray(data.images_to_update)) {
    data.images_to_update.forEach((i) => {
      formData.append('images_to_update', String(i));
    });
  }

  // Archivos nuevos
  files.forEach((file) => {
    formData.append('files[]', file);
  });

  const res = await fetch(`${API_URL}/carousel/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: getToken(),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Error actualizando carrusel:', err);
    throw new Error('Error al actualizar el carrusel');
  }

  return await res.json();
}
