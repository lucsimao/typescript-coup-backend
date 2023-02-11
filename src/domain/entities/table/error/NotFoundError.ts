export class InfluenceNotFoundError extends Error {
  constructor() {
    super('Influence not found in player table');
    this.name = 'InfluenceNotFoundError';
  }
}
