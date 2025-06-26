import { RegisterServicesAuth } from "@/data/services/auth/AuthServices";
import type { RegisterModel } from "@/domain/models/AuthModel";

import { useUserStore } from "@/stores/user";

export async function RegisterUser(params: RegisterModel): Promise<void> {
  try {
    const response = await RegisterServicesAuth(params);
    
    const userStore = useUserStore();
    userStore.setUser({
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      token: response.token,
    });

    // Al registrarse también se guarda el usuario automáticamente

  } catch (error) {
    console.error("Error en RegisterUserUseCase:", error);
    throw error;
  }
}
