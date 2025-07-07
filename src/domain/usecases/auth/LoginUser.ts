import { LoginServicesAuth } from "@/data/services/auth/AuthServices";
import type { LoginModel } from "@/domain/models/AuthModel";
import { useUserStore } from "@/stores/user";

export async function LoginUser(params: LoginModel): Promise<string> {
  try {
    const response = await LoginServicesAuth(params);

    // Validación estricta
    if (!response || !response.user || !response.token || !response.user.roles?.length) {
      throw new Error("Credenciales inválidas");
    }

    const roleData = response.user.roles[0];

    const userStore = useUserStore();
    userStore.setUser({
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      token: response.token,
      role: roleData.id,
      route: roleData.route,
    });

    return roleData.route || '/';

  } catch (error) {
    console.error("Error en LoginUserUseCase:", error);
    throw new Error('Credenciales incorrectas o servidor no disponible');
  }
}
