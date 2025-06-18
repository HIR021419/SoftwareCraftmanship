import { BadRequestException, Injectable } from '@nestjs/common';
import { ParseBlueprintsInputDto } from './dto/parse-blueprints-input.dto';
import { BlueprintDto } from '../blueprints/dto/BlueprintDto';
import { ResourceType } from './resource-type.enum'; // See below
import { RobotCostParser } from './robot-cost.parser'; // See below

@Injectable()
export class ParserService {
  constructor(private readonly robotCostParser: RobotCostParser) {}

  parse(input: ParseBlueprintsInputDto): BlueprintDto[] {
    const blueprints: BlueprintDto[] = [];

    for (const line of input.lines) {
      if (line.trim() === '') continue;

      try {
        const [index, robotCosts] = this.robotCostParser.parseLine(line);
        blueprints.push(new BlueprintDto(index, robotCosts));
      } catch (err) {
        throw new BadRequestException(
          `Invalid blueprint input: ${err.message}`,
        );
      }
    }

    return blueprints;
  }
}
