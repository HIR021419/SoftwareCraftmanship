import { Injectable } from '@nestjs/common';
import { Blueprint } from './models/blueprint';
import { State } from './models/state';
import { BlueprintDto } from '../blueprints/dto/BlueprintDto';
import { ConfigService } from '@nestjs/config';
import { AlgorithmConfig } from '../config/configuration';

@Injectable()
export class BlueprintsAnalysisService {
  private readonly maxRessourceIndex: number;
  private readonly ticks: number;
  private readonly maxStates: number;

  constructor(private readonly configService: ConfigService) {
    const algorithmConfig =
      this.configService.get<AlgorithmConfig>('algorithm');

    this.maxRessourceIndex = algorithmConfig?.max_index ?? 4;
    this.ticks = algorithmConfig?.ticks ?? 24;
    this.maxStates = algorithmConfig?.max_states ?? 1000;
  }

  testBlueprint(blueprint_dto: BlueprintDto): number {
    const algorithmConfig =
      this.configService.get<AlgorithmConfig>('algorithm');

    let currentStates: State[] = [new State()];
    let previousStates: State[] = [];

    const blueprint: Blueprint = new Blueprint(
      blueprint_dto.index,
      blueprint_dto.robotCosts,
    );

    const robots = blueprint.robots;

    for (let i = 0; i < this.ticks; i++) {
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
      newStates.sort((a, b) => this.sortFunction(a, b));
      currentStates = newStates.slice(0, this.maxStates); // Limit state space to avoid combinatorial explosion
    }

    return (
      blueprint.index *
      currentStates[0].resources[algorithmConfig?.max_index ?? 4]
    );
  }

  // Sort by most diamonds, then robots, then resources
  private sortFunction(a: State, b: State): number {
    const diamondsDiff =
      b.getResource(this.maxRessourceIndex) -
      a.getResource(this.maxRessourceIndex);
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
