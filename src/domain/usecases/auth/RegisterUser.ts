import { RegisterServicesAuth } from "@/data/services/auth/AuthServices";
import type { RegisterModel } from "@/domain/models/AuthModel";
import { useUserStore } from "@/stores/user";

export async function RegisterUser(params: RegisterModel): Promise<void> {
  try {
    console.log('[RegisterUser] Enviando datos:', params);

    const response = await RegisterServicesAuth(params);
    console.log('[RegisterUser] Respuesta recibida:', response);

    const user = response.user;
    const primaryRole = user.roles?.[0]; // cliente por defecto

    const userStore = useUserStore();
    userStore.setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      token: response.token,
      role: primaryRole?.id || 'CLIENT',
      route: primaryRole?.route || '/client/home',
      image: user.image || '',
    });

    console.log('[RegisterUser] Usuario guardado en store');

  } catch (error) {
    console.error('[RegisterUser] ERROR:', error);
    throw error;
  }
}
