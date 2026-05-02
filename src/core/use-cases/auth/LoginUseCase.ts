import { type AuthRepository } from "../../repositories/AuthRepository";

export class LoginUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Email y contraseña son requeridos");
    }

    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    const result = await this.authRepository.login(email, password);

    if (!result.user) {
      throw new Error("Credenciales inválidas");
    }

    return result;
  }
}
