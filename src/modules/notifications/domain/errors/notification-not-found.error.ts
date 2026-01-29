export class NotificationNotFoundError extends Error {
  constructor(id: number) {
    super(`Notification with id ${id} not found`);
    this.name = 'NotificationNotFoundError';
  }
}
