export class Cost {
  costs: number[];

  constructor(costs: number[]) {
    this.costs = costs;
  }

  static fromArray(arr: number[]): Cost {
    const costs = [0, 0, 0, 0, 0];
    arr.forEach((v, i) => {
      costs[i] = v;
    });
    return new Cost(costs);
  }

  get(index: number): number {
    return this.costs[index];
  }
}
