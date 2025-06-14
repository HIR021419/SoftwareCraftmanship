import { BadRequestException, Injectable } from '@nestjs/common';
import { ParseBlueprintsInputDto } from './dto/parse-blueprints-input.dto';
import { Blueprint } from '../models/Blueprint';

@Injectable()
export class ParserService {
  parse(input: ParseBlueprintsInputDto): Blueprint[] {
    const blueprints: Blueprint[] = [];

    for (const line of input.lines) {
      if (line.trim() === '') continue;

      const regex =
        /Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\./;
      const match = regex.exec(line);
      if (!match) throw new BadRequestException('Invalid input');

      const index = parseInt(match[1]);
      const oreCost = [parseInt(match[2]), 0, 0, 0, 0];
      const clayCost = [parseInt(match[3]), 0, 0, 0, 0];
      const obsidianCost = [parseInt(match[4]), parseInt(match[5]), 0, 0, 0];
      const geodeCost = [parseInt(match[6]), 0, parseInt(match[7]), 0, 0];

      const robotCosts = [oreCost, clayCost, obsidianCost, geodeCost];

      blueprints.push(Blueprint.fromParsed(index, robotCosts));
    }

    return blueprints;
  }
}
