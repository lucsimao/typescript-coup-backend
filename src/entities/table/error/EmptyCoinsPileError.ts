export class EmptyCoinsPileError extends Error {
  constructor() {
    super('Cannot remove coin from empty pile');
    this.name = 'EmptyCoinsPileError';
  }
}
