import { Robot } from './robot';

export class Blueprint {
  constructor(
    public index: number,
    public robotCosts: number[][],
  ) {}

  static fromParsed(index: number, robotCosts: number[][]): Blueprint {
    return new Blueprint(index, robotCosts);
  }

  get robots(): Robot[] {
    return this.robotCosts.map(
      (cost, mineralIndex) => new Robot(mineralIndex, cost),
    );
  }
}
