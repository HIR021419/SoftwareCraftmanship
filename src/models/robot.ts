import { State } from './state';

export class Robot {
  mineralIndex: number;
  cost: number[];

  constructor(mineralIndex: number, cost: number[]) {
    this.mineralIndex = mineralIndex;
    this.cost = cost;
  }

  addRobot(state: State): State | null {
    if (!this.canBuild(state)) return null;
    const newState = state.clone();

    for (let i = 0; i < this.cost.length; i++) {
      newState.resources[i] -= this.cost[i];
    }

    newState.robots[this.mineralIndex]++;
    newState.resources[this.mineralIndex]--; // compensate 1-min delay before build

    return newState;
  }

  canBuild(state: State): boolean {
    return this.cost.every((c, i) => state.resources[i] >= c);
  }
}
