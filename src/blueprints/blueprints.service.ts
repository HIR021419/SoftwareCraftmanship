import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ParserService } from '../parser/parser.service';
import { Blueprint } from '../models/blueprint';
import * as fs from 'fs';
import * as path from 'path';
import { State } from '../models/state';
import { ResponseDto, ResultDto } from './dto/Response.dto';
import { FileService } from '../file/file.service';
import * as process from 'node:process';

@Injectable()
export class BlueprintsService {
  constructor(
    private readonly parserService: ParserService,
    private readonly fileService: FileService,
  ) {}

  public async analyzeBlueprints() {
    const inputPath = process.env.INPUT ?? "inputs/input.txt";
    const inputData = await this.fileService.readFileAsInput(inputPath);

    const blueprints: Blueprint[] = this.parserService.parse(inputData);

    const results = blueprints.map((bp) => {
      const quality = this.testBlueprint(bp);

      return new ResultDto(bp.index, quality);
    });

    const bestBlueprint = results.reduce((best, current) =>
      current.quality > best.quality ? current : best,
    );

    const response = new ResponseDto(bestBlueprint.id, results);
    await this.fileService.writeTextToFile(
      process.env.OUTPUT ?? "./analysis.txt",
      response.asString(),
    );

    return response;
  }

  private testBlueprint(blueprint: Blueprint): number {
    let currentStates: State[] = [new State()];
    let previousStates: State[] = [];

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
      const MAX_STATES = 1000; // Prune useless states
      currentStates = newStates.slice(0, MAX_STATES);
    }

    return blueprint.index * currentStates[0].resources[4];
  }

  private sortFunction(a: State, b: State): number {
    let diamondsDiff = b.getResource(4) - a.getResource(4);
    if (diamondsDiff != 0) return diamondsDiff;
    for (let i = a.robots.length - 1; i >= 0; i--) {
      let diff: number = b.robots[i] - a.robots[i];
      if (diff != 0) return diff;
    }
    for (let i: number = a.resources.length - 1; i >= 0; i--) {
      let diff: number = b.getResource(i) - a.getResource(i);
      if (diff != 0) return diff;
    }
    return 0;
  }
}
