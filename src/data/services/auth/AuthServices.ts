import { API_AUTH } from "@/data/api/ApiOasisBack";
import type { LoginModel, RegisterModel } from "@/domain/models/AuthModel";

// SERVICES.LOGIN
export async function LoginServicesAuth(params: LoginModel): Promise<any> {
  const response = await fetch(`${API_AUTH}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Error al iniciar sesión');
  }

  return await response.json();
}

//SERVICES.REGISTER
export async function RegisterServicesAuth(params: RegisterModel): Promise<any> {
    const response = await fetch(`${API_AUTH}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  
    if (!response.ok) {
      throw new Error('Error al registrarse');
    }
  
    return await response.json();
  }