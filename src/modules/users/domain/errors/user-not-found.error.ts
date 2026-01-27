export class UserNotFoundError extends Error {
  constructor(id: number) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundError';
  }
}

// Esto NO sabe nada de HTTP ni Nest
// Es dominio puro
