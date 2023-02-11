export class PlayerTableNotFoundError extends Error {
  constructor() {
    super('Player Table not found in the coup table');
    this.name = 'PlayerTableNotFoundError';
  }
}
