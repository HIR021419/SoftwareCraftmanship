import { Injectable } from '@nestjs/common';
import { Blueprint } from '../models/blueprint';
import { State } from '../models/state';
import { BlueprintDto } from '../blueprints/dto/BlueprintDto';

@Injectable()
export class BlueprintsAnalysisService {
  testBlueprint(blueprint_dto: BlueprintDto): number {
    let currentStates: State[] = [new State()];
    let previousStates: State[] = [];

    const blueprint: Blueprint = new Blueprint(
      blueprint_dto.index,
      blueprint_dto.robotCosts,
    );

    const robots = blueprint.robots;

    for (let i = 0; i < 24; i++) {
      previousStates = [...currentStates];
      const newStates: State[] = [];

      for (const state of previousStates) {
        for (const robot of robots) {
          const newState = robot.addRobot(state);
          if (newState) newStates.push(newState);
        }
        newStates.push(state);
      }

      newStates.forEach((state) => state.mineResources());
      newStates.sort(this.sortFunction);
      const MAX_STATES = 1000; // Limit state space to avoid combinatorial explosion
      currentStates = newStates.slice(0, MAX_STATES);
    }

    return blueprint.index * currentStates[0].resources[4];
  }

  // Sort by most diamonds, then robots, then resources
  private sortFunction(a: State, b: State): number {
    const diamondsDiff = b.getResource(4) - a.getResource(4);
    if (diamondsDiff != 0) return diamondsDiff;
    for (let i = a.robots.length - 1; i >= 0; i--) {
      const diff: number = b.robots[i] - a.robots[i];
      if (diff != 0) return diff;
    }
    for (let i: number = a.resources.length - 1; i >= 0; i--) {
      const diff: number = b.getResource(i) - a.getResource(i);
      if (diff != 0) return diff;
    }
    return 0;
  }
}
