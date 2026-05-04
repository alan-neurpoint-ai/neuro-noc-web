export interface BaseRepository<T, CreateDTO, UpdateDTO, Filters = void> {
  findAll(filters?: Filters): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  /**
   * Soft delete - marca el registro como inactivo en lugar de eliminarlo físicamente
   * @param id - ID del registro
   * @param reason - Razón de la eliminación (opcional)
   */
  softDelete(id: string, reason?: string): Promise<void>;
}
