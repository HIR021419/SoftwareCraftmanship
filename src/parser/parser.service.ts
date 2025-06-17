import { BadRequestException, Injectable } from '@nestjs/common';
import { ParseBlueprintsInputDto } from './dto/parse-blueprints-input.dto';
import { BlueprintDto } from '../blueprints/dto/BlueprintDto';

@Injectable()
export class ParserService {
  parse(input: ParseBlueprintsInputDto): BlueprintDto[] {
    const blueprints: BlueprintDto[] = [];

    for (const line of input.lines) {
      if (line.trim() === '') continue;

      const regex =
        /Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\. Each diamond robot costs (\d+) geode, (\d+) clay and (\d+) obsidian\./;
      const match = regex.exec(line);
      if (!match) throw new BadRequestException('Invalid input');

      // TODO split blueprint string on '.' and foreach loop on each robot
      const index = parseInt(match[1]);
      const oreCost = [parseInt(match[2]), 0, 0, 0, 0];
      const clayCost = [parseInt(match[3]), 0, 0, 0, 0];
      const obsidianCost = [parseInt(match[4]), parseInt(match[5]), 0, 0, 0];
      const geodeCost = [parseInt(match[6]), 0, parseInt(match[7]), 0, 0];
      const diamondCost = [
        0,
        parseInt(match[9]),
        parseInt(match[10]),
        parseInt(match[8]),
        0,
      ];

      const robotCosts = [
        oreCost,
        clayCost,
        obsidianCost,
        geodeCost,
        diamondCost,
      ];

      blueprints.push(new BlueprintDto(index, robotCosts));
    }

    return blueprints;
  }
}
