import { API_URL } from "@/data/api/ApiOasisBack"
import type { CarouselGetModel, CarouselPostModel } from "@/domain/models/CarouselModel"

//GET TOKEN OF PINIA AND LOCALSTORAGE
function getToken(): string {
  const data = localStorage.getItem("userDetailOasisPremiun")
  const parsed = data ? JSON.parse(data) : {}
  return parsed.token || ""
}

//LIST FOR USER
export async function fetchCarousels(): Promise<CarouselGetModel[]> {
  const res = await fetch(`${API_URL}/carousel`, {
    headers: { Authorization: getToken() },
  })
  if (!res.ok) throw new Error("Error al cargar carruseles")
  return await res.json()
}

//LIST FOR ADMIN
export async function fetchCarouselsAdmin(): Promise<CarouselGetModel[]> {
  const res = await fetch(`${API_URL}/carousel/admin`, {
    headers: { Authorization: getToken() },
  })
  if (!res.ok) throw new Error("Error al cargar carruseles para admin")
  return await res.json()
}

//LIST BY ID
export async function fetchCarouselByIdUseCase(id: number): Promise<CarouselGetModel> {
  const res = await fetch(`${API_URL}/carousel/admin`, {
    headers: { Authorization: getToken() },
  })
  if (!res.ok) throw new Error("Error al obtener carruseles")

  const all: CarouselGetModel[] = await res.json()
  const found = all.find(c => c.id === id)
  if (!found) throw new Error("Carrusel no encontrado")
  return found
}
//CREATE
export async function createCarousel(formData: FormData): Promise<CarouselPostModel> {
  const res = await fetch(`${API_URL}/carousel`, {
    method: "POST",
    headers: { Authorization: getToken() },
    body: formData,
  })
  if (!res.ok) throw new Error("Error al crear carrusel")
  return await res.json()
}

//DELETE
export async function deleteCarouselById(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/carousel/${id}`, {
    method: "DELETE",
    headers: { Authorization: getToken() },
  })
  if (!res.ok) throw new Error("Error al eliminar carrusel")
}

//PUT
export async function updateCarouselFormData(
  id: number,
  data: {
    title?: string;
    description?: string;
    is_enabled?: boolean;
    images_to_update?: number[];
    images_to_delete?: number[];
  },
  files: File[]
): Promise<CarouselGetModel> {
  const formData = new FormData();

  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (typeof data.is_enabled !== 'undefined') {
    formData.append('is_enabled', String(data.is_enabled));
  }

  if (Array.isArray(data.images_to_delete)) {
    formData.append('images_to_delete', JSON.stringify(data.images_to_delete));
  }

  if (Array.isArray(data.images_to_update)) {
    formData.append('images_to_update', JSON.stringify(data.images_to_update));
  }

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

// STATUS OF CAROUSEL 
export async function toggleCarouselStatus(id: number, is_enabled: boolean): Promise<void> {
  const res = await fetch(`${API_URL}/carousel/status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken(),
    },
    body: JSON.stringify({ is_enabled }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error("Error en toggleCarouselStatus:", errorText)
    throw new Error("No se pudo cambiar el estado del carrusel")
  }
}
