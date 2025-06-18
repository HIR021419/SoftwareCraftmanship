export class State {
  resources: number[];
  robots: number[];

  constructor(resources?: number[], robots?: number[]) {
    this.resources = resources ? [...resources] : [0, 0, 0, 0, 0];
    this.robots = robots ? [...robots] : [1, 0, 0, 0, 0];
  }

  mineResources(): void {
    for (let i = 0; i < this.resources.length; i++) {
      this.resources[i] += this.robots[i];
    }
  }

  getResource(index: number): number {
    return this.resources[index];
  }

  clone(): State {
    return new State(this.resources.slice(), this.robots.slice());
  }

  toString(): string {
    let res = 'robots ';
    for (let i = 0; i < this.robots.length; i++) {
      res += `${i}: ${this.robots[i]}; `;
    }
    res += '\nresources ';
    for (let i = 0; i < this.resources.length; i++) {
      res += `${i}: ${this.resources[i]}; `;
    }
    return res;
  }
}
