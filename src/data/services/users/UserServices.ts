import { API_URL } from "@/data/api/ApiOasisBack";
import type { UserModeleGet, UserModelPost } from "@/domain/models/UserModel";

function getToken(): string {
  const data = localStorage.getItem('userDetailOasisPremiun')
  const parsed = data ? JSON.parse(data) : {}
  return parsed.token || ''
}

// CREATE -> USER
  export async function postUserData(userData: FormData): Promise<UserModelPost> {
    const localUserData = localStorage.getItem("userData");
    const parsed = localUserData ? JSON.parse(localUserData) : {};
    const token = parsed.token || "";
  
    const response = await fetch(`${API_URL}/users/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token,

      },
      body: userData,
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Respuesta del servidor:", errorText);
      throw new Error('Error al crear el cliente');
    }
  
    return await response.json();
  }
  
// LIST -> USERS -> CLIENTS -> ROUTE -> ADMIN
export async function fetchUsers(): Promise<UserModelPost> {
    const response = await fetch(`${API_URL}/users/clients`, {
      method: 'GET',
      headers: {
         Authorization: getToken() 
        },
    });
  
    if (!response.ok) {
  const errorText = await response.text(); // Agrega esto
  console.error("Respuesta del servidor (fetchUsers):", errorText); // Para más contexto
  throw new Error('Error al cargar usuarios');
} 
    return await response.json();
}
  
// UPDATE -> USER
export async function updateUserData(userId: number, userData: UserInterfacePost): Promise<void> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
    }
}

// DELETE -> USER
export async function deleteUserById(userId: number): Promise<void> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
    }
}

// LISTBYID -> USER
export async function fetchUserById(userId: number): Promise<UserModeleGet> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Error al obtener el usuario');
    }
    return response.json();
}