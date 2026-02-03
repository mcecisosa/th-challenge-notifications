export class EntityNotFoundError extends Error {
  constructor(entityName: string, id: number) {
    super(`${entityName} with id ${id} not found`);
    this.name = 'EntityNotFoundError';
  }
}

// Esto NO sabe nada de HTTP ni Nest
// Es dominio puro
