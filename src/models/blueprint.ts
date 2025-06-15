import { Robot } from './robot';

export class Blueprint {
  constructor(
    public index: number,
    public robotCosts: number[][],
  ) {}

  get robots(): Robot[] {
    return this.robotCosts.map(
      (cost, mineralIndex) => new Robot(mineralIndex, cost),
    );
  }
}
