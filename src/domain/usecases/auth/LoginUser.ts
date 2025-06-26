import { LoginServicesAuth } from "@/data/services/auth/AuthServices";
import type { LoginModel } from "@/domain/models/AuthModel";

import { useUserStore } from "@/stores/user";

export async function LoginUser(params: LoginModel): Promise<void> {
  try {
    const response = await LoginServicesAuth(params);
    
    const userStore = useUserStore();
    userStore.setUser({
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      token: response.token,
    });

    // Listo: datos en store + localStorage

  } catch (error) {
    console.error("Error en LoginUserUseCase:", error);
    throw error;
  }
}
