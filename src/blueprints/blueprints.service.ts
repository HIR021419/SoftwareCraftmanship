import { Injectable } from '@nestjs/common';
import { ParserService } from '../parser/parser.service';
import { Blueprint } from '../models/blueprint';
import * as fs from 'fs';
import * as path from 'path';
import { State } from '../models/state';
import { ResponseDto, ResultDto } from './dto/Response.dto';
import { FileService } from '../file/file.service';

@Injectable()
export class BlueprintsService {
  constructor(
    private readonly parserService: ParserService,
    private readonly fileService: FileService,
  ) {}

  public async analyzeBlueprints() {
    const inputPath = path.join(__dirname, 'input_diamond.txt');
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
      path.join(__dirname, 'output.txt'),
      response.asString(),
    );

    return response;
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
      const MAX_STATES = 10000;
      currentStates = newStates.slice(0, MAX_STATES);
    }

    return blueprint.index * this.getMax(currentStates);
  }

  private getMax(states: State[]): number {
    if (states.length === 0) return 0;
    return Math.max(...states.map((s) => s.getResource(4)));
  }
}
