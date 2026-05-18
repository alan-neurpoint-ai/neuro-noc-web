import type { RoleEntity } from "../domain/entities/role.entity";
import type { RoleRepository } from "../domain/ports/role.repository";

export const getAllRolesUseCase = async (
  roleRepository: RoleRepository,
): Promise<RoleEntity[]> => {
  return await roleRepository.getAll();
};
