import { Injectable } from '@nestjs/common';
import { ParserService } from '../parser/parser.service';
import { Blueprint } from '../models/Blueprint';
import { ComputeRequestDto } from './dto/compute-request.dto';
import * as fs from 'fs';
import * as path from 'path';
import { State } from '../models/State';
import { Response, Result } from '../models/Response';

@Injectable()
export class ComputeService {
  constructor(private readonly blueprintParserService: ParserService) {}

  compute(dto: ComputeRequestDto): any {
    let inputData: string[];

    if (!dto.input) {
      const filePath = path.join(__dirname, '../../inputs/input_diamond.txt');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      inputData = fileContent.split('\n');
    } else {
      inputData = dto.input.split('\n');
    }

    const blueprints: Blueprint[] = this.blueprintParserService.parse({
      lines: inputData,
    });

    const response = this.processBlueprints(blueprints);

    return response;
  }
  processBlueprints(blueprints: Blueprint[]): Response {
    const results: Result[] = blueprints.map((bp) => {
      const res = this.testBlueprint(bp);
      const result = new Result();
      result.index = bp.index;
      result.result = res;
      return result;
    });

    return new Response(results);
  }

  private testBlueprint(blueprint: Blueprint): number {
    let currentStates: State[] = [new State()];
    let previousStates: State[] = [];

    for (let i = 0; i < 24; i++) {
      previousStates = [...currentStates];
      const newStates: State[] = [];

      for (const state of previousStates) {
        for (const robot of blueprint.robots) {
          const newState = robot.addRobot(state);
          if (newState) newStates.push(newState);
        }
        newStates.push(state);
      }

      newStates.forEach((state) => state.mineResources());
      newStates.sort((a, b) => b.getResource(4) - a.getResource(4));
      currentStates = newStates;
    }

    return blueprint.index * this.getMax(currentStates);
  }

  private getMax(states: State[]): number {
    if (states.length === 0) return 0;
    return Math.max(...states.map((s) => s.getResource(4)));
  }
}
