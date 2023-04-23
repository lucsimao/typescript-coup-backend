export class CannotDrawFromEmptyDeckError extends Error {
  constructor() {
    super('Cannot draw influence from empty deck');
    this.name = 'EmptyDeckError';
  }
}
